import { useLocation } from "react-router-dom";

export function Callback() {
  const { hash } = useLocation();
  console.log(hash);

  return (
    <div>
      <h1>Callback</h1>
    </div>
  );
}
