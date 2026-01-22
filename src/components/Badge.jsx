function Badge({ text, type }) {
  const styles = {
    success: "text-green-600",
    danger: "text-red-500",
    warning: "text-yellow-500"
  };

  return (
    <span className={`text-xs font-medium ${styles[type]}`}>
      • {text}
    </span>
  );
}

export default Badge;
