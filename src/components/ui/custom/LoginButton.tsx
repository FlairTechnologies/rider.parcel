import { Button } from "../button";

export const LoginButton = ({ onClick }: { onClick: any }) => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        onClick;
      }}
    >
      Login
    </Button>
  );
};
