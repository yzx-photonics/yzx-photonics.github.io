const navToggle = document.querySelector(".nav-toggle");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const messageForm = document.querySelector("#messageForm");

if (messageForm) {
  const copyButton = document.querySelector("#copyMessage");
  const submitButton = messageForm.querySelector("button[type='submit']");
  const messageOutput = document.querySelector("#messageOutput");
  const messagePreview = document.querySelector("#messagePreview");
  const messageStatus = document.querySelector("#messageStatus");
  const recipientToken = "MTc2MDUxMzMwQHFxLmNvbQ==";
  const messageEndpoint = `https://formsubmit.co/ajax/${atob(recipientToken)}`;

  const buildMessage = () => {
    const data = new FormData(messageForm);
    const submittedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const organization = data.get("organization") || "未填写";

    return [
      "【旸之芯官网留言】",
      `提交时间：${submittedAt}`,
      `姓名：${data.get("name")}`,
      `单位/团队：${organization}`,
      `联系方式：${data.get("contact")}`,
      `合作主题：${data.get("topic")}`,
      "",
      "留言内容：",
      data.get("message")
    ].join("\n");
  };

  const buildPayload = (message) => {
    const data = new FormData(messageForm);
    const payload = new FormData();

    payload.append("姓名", data.get("name"));
    payload.append("单位/团队", data.get("organization") || "未填写");
    payload.append("联系方式", data.get("contact"));
    payload.append("合作主题", data.get("topic"));
    payload.append("留言内容", data.get("message"));
    payload.append("留言备份", message);
    payload.append("来源", "YZX Photonics 官网在线留言");
    payload.append("_subject", `旸之芯官网留言 - ${data.get("topic")}`);
    payload.append("_template", "table");
    payload.append("_captcha", "false");

    return payload;
  };

  const setSubmitting = (isSubmitting) => {
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "发送中..." : "发送留言";
  };

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!messageForm.reportValidity()) {
      return;
    }

    const message = buildMessage();
    messagePreview.textContent = message;
    messageOutput.hidden = false;
    copyButton.disabled = false;
    messageStatus.textContent = "正在发送留言...";
    setSubmitting(true);

    try {
      const response = await fetch(messageEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: buildPayload(message)
      });

      if (!response.ok) {
        throw new Error("Submit failed");
      }

      messageStatus.textContent = "留言已发送。我们会尽快通过您留下的联系方式回复。";
      messageForm.reset();
    } catch (error) {
      messageStatus.textContent = "暂时未能发送到邮箱，请复制留言后通过微信 15623326967 发送给我们。";
    } finally {
      setSubmitting(false);
    }
  });

  copyButton.addEventListener("click", async () => {
    const message = messagePreview.textContent;

    try {
      await navigator.clipboard.writeText(message);
      messageStatus.textContent = "已复制留言内容，可直接粘贴到微信发送。";
    } catch (error) {
      messageStatus.textContent = "浏览器未允许自动复制，请手动选中下方留言内容复制。";
    }
  });
}
