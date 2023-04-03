import React from "react";
import ReactDOM from "react-dom/client";
import fetch from "node-fetch";
import { Field, Form, Formik, FormikErrors } from "formik";

// Should be set by webpack
declare const API_URL: string;
const domNode = document.getElementById("replace-me") as HTMLElement;
const root = ReactDOM.createRoot(domNode);

interface FormProps {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  amortizationPeriod: number;
  schedule: string;
}

const FormComponent: React.FC<{
  data: FormProps;
}> = (props) => {
  const [error, setError] = React.useState(false);
  const [result, setResult] = React.useState<string | undefined>(undefined);

  const handleSubmit = async (values: FormProps): Promise<void> => {
    console.log(values);
    setError(false);
    const requestParams = {
      propertyPrice: values.propertyPrice.toString(),
      downPayment: values.downPayment.toString(),
      annualInterestRate: values.annualInterestRate.toString(),
      amortizationPeriod: values.amortizationPeriod.toString(),
      schedule: values.schedule,
    };
    try {
      const res = await fetch(
        `${API_URL}/calculate?${new URLSearchParams(requestParams)}`,
        {
          method: "GET",
        }
      );
      if (res.ok) {
        setResult((await res.json()).result as string);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  return (
    <div>
      {error ? (
        <div style={{ color: "red", marginBottom: "4px" }}>
          Something went wrong. Please try again
        </div>
      ) : (
        result !== undefined && (
          <div style={{ marginBottom: "4px" }}>Calculated amount: {result}</div>
        )
      )}
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validate={(_values) => {
          const errors: FormikErrors<FormProps> = {};
          return errors;
        }}
      >
        {({}) => (
          <Form>
            <div>
              <label
                htmlFor={`propertyPrice`}
                style={{
                  marginBottom: "4px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                Property Price
              </label>
              <Field name="propertyPrice" type="number" min={0} step={0.01} />
            </div>
            <div>
              <label
                htmlFor={`downPayment`}
                style={{
                  marginBottom: "4px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                Down Payment
              </label>
              <Field name="downPayment" type="number" min={0} step={0.01} />
            </div>
            <div>
              <label
                htmlFor={`annualInterestRate`}
                style={{
                  marginBottom: "4px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                Annual Interest Rate
              </label>
              <Field
                name="annualInterestRate"
                type="number"
                step={0.01}
                min={0.01}
                max={100}
              />
            </div>
            <div>
              <label
                htmlFor={`amortizationPeriod`}
                style={{
                  marginBottom: "4px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                Ammortization Period
              </label>
              <Field
                name="amortizationPeriod"
                type="number"
                step={5}
                min={5}
                max={30}
              />
            </div>
            <div>
              <label
                htmlFor={`schedule`}
                style={{
                  marginBottom: "4px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                Schedule
              </label>
              <Field name="schedule" as="select">
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="accelerated-bi-weekly">
                  Accelerated Bi-Weekly
                </option>
              </Field>
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

root.render(
  <React.StrictMode>
    <h1>Mortgage Calculator</h1>
    <FormComponent
      data={{
        propertyPrice: 0,
        downPayment: 0,
        annualInterestRate: 2,
        amortizationPeriod: 5,
        schedule: "monthly",
      }}
    />
  </React.StrictMode>
);
