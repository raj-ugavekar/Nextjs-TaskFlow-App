export function getNavItems(isLoggedIn) {
  return [
    { name: "Home", route: "/", active: isLoggedIn },
    { name: "Todos", route: "/todos", active: isLoggedIn },
    { name: "Task Board", route: "/task-board", active: isLoggedIn },
    { name: "Login", route: "/login", active: !isLoggedIn },
    { name: "Signup", route: "/register", active: !isLoggedIn },
  ];
}

export function getUrgencyColorClass(deadline) {
  const now = new Date();
  const due = new Date(deadline);

  const diffMinutes = Math.floor((due - now) / (1000 * 60));

  if (diffMinutes < 0) {
    return "bg-red-500 text-white";
  }
  if (diffMinutes <= 10) {
    return "bg-red-400 text-white";
  }
  if (diffMinutes <= 30) {
    return "bg-yellow-400 text-black";
  }
  return "bg-green-400 text-black";
}

