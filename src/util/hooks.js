import { useState } from "react";
export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback(); // is parents pass in function will be trigger here
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
