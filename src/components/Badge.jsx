function Badge({ text, type }) {
  const styles = {
    success: "text-green-600",
    danger: "text-red-500",
    warning: "text-yellow-500"
  };

  return (
    <span className={`text-md font-bold ${styles[type]}`}>
      • {text}
    </span>
  );
}

export default Badge;
