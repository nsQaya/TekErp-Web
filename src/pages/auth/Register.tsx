import { useCallback, useState } from "react";
import api from "../../utils/api";

export default () => {
  const [userName, setUserName] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const testRegister = useCallback(async () => {
    if (userName && password) {
      var response = await api.auth.register(userName, password);
      if (!response.data.status) {
        alert(response.data.detail);
        return;
      }
    }
  }, [userName, password]);

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <h1>Register Page | {userName} </h1>

      <form onSubmit={testRegister}>
        <input
          type="text"
          value={userName || ""}
          onChange={handleUserNameChange}
        /><br></br>
        <input
          type="text"
          value={password || ""}
          onChange={handlePasswordChange}
        />
        <button type="submit">Kayıt Ol</button>
      </form>
    </>
  );
};
