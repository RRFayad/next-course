import { Button } from "@nextui-org/react";
import * as actions from "@/actions";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <form action={actions.signIn}>
        <Button type="submit">Sign in!!</Button>
      </form>
      <form action={actions.signOut}>
        <Button type="submit">Sign Out!!</Button>
      </form>
      {session?.user ? <div>Signed in - {JSON.stringify(session.user)}</div> : <div> Signed out </div>}
    </div>
  );
}
