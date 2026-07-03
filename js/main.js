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
  const messageOutput = document.querySelector("#messageOutput");
  const messagePreview = document.querySelector("#messagePreview");
  const messageStatus = document.querySelector("#messageStatus");

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

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = buildMessage();
    messagePreview.textContent = message;
    messageOutput.hidden = false;
    copyButton.disabled = false;
    messageStatus.textContent = "留言已生成。请点击复制留言，并通过微信 15623326967 发送给我们。";
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
