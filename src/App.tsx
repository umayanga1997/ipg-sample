import { useRef } from "react";
import "./App.css";
import { v1 } from "uuid";
import { dateTime } from "./utils/datetime";
import { TextField, Button } from "@mui/material";
import sign from "./utils/signature";

function App() {
  const refSubmitButtom = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function pay() {
    // Current Form
    const form = formRef.current!;    

    // To generate Json object to make a signature key
    // console.log(formRef.current?.access_key.value);
    const objectMap: any = {};
    for (const key in form.elements) {
      if (form.elements[key].tagName === "INPUT") {
        objectMap[form.elements[key].name] = form.elements[key].value!;
      }
    }
    
    // generate & Set signature value to the form ref
    const signKey = await sign(objectMap);
    // Add the JSON string to a hidden input field in the form
    const jsonInput = document.createElement("input");
    jsonInput.type = "hidden";
    jsonInput.name = "signature";
    jsonInput.value = signKey;
    form.appendChild(jsonInput);

    form.submit();
    // setTimeout(() => {
    //   refSubmitButtom?.current?.click();
    // }, 1000);
  }

  return (
    <>
      <form
        action="https://testsecureacceptance.cybersource.com/pay"
        method="post"
        onSubmit={pay}
        ref={formRef}
      >
        {/* <!--Replace Keys--> */}
        <input
          type="hidden"
          name="access_key"
          value={import.meta.env.VITE_ACCESS_KEY}
        />
        <input
          type="hidden"
          name="profile_id"
          value={import.meta.env.VITE_PROFILE_ID}
        />
        <input type="hidden" name="transaction_uuid" value={v1()} />

        {/* <!--Check these Values--> */}
        <input
          type="hidden"
          name="signed_field_names"
          value="access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency"
        />
        <input
          type="hidden"
          name="unsigned_field_names"
          value="auth_trans_ref_no,bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_country,bill_to_email"
        />

        <input type="hidden" name="signed_date_time" value={dateTime()} />
        <input type="hidden" name="locale" value="en" />

        <div className="form-references">
          <h3>Payment Details</h3>
          {dateTime()}
          <div id="paymentDetailsSection" className="section">
            <TextField
              id="outlined-basic"
              label="Transaction Type"
              variant="outlined"
              name="transaction_type"
              size="small"
            />
            <TextField
              id="outlined-basic"
              label="Reference Number"
              variant="outlined"
              name="reference_number"
              size="small"
            />
            {/* <!--Add this Parameter--> */}
            <TextField
              id="outlined-basic"
              label="Auth Transaction Ref No"
              variant="outlined"
              name="auth_trans_ref_no"
              size="small"
            />
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              name="amount"
              size="small"
            />
            <TextField
              id="outlined-basic"
              label="Currency"
              variant="outlined"
              name="currency"
              size="small"
            />
          </div>
        </div>
        {/* <!--Add these billing Parameters--> */}
        <input
          type="hidden"
          name="bill_to_email"
          value="erandikar@peoplesbank.lk"
        />
        <input type="hidden" name="bill_to_forename" value="NOREAL" />
        <input type="hidden" name="bill_to_surname" value="NAME" />
        <input
          type="hidden"
          name="bill_to_address_line1"
          value="1295 Charleston Road "
        />
        <input type="hidden" name="bill_to_address_city" value="MMs" />
        <input type="hidden" name="bill_to_address_country" value="LK" />
        {/* <input type="hidden" name="signature" value={sign()} /> */}

        <button hidden={true} ref={refSubmitButtom} type={"submit"} />
      </form>
      <Button variant="outlined" onClick={pay}>
        Payment
      </Button>
    </>
  );
}

export default App;
