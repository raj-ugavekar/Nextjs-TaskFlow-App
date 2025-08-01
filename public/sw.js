self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo-icon.svg",
    renotify: true,
    tag: data.tag || "task-reminder",
  });
});
