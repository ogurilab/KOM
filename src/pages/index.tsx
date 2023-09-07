import { Button } from "@/components/Button";
import { Google } from "@/features/auth/components/Google";

export default function Home() {
  return (
    <div>
      <Google />
      <Google />
      <Button onClickHandler={() => console.log("clickです")}>click</Button>
    </div>
  );
}
