import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState } from "react";
import validator from "email-validator";
import Button from "./Button";

const Form = () => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    access_key: process.env.CONTACT_ACCESS_KEY,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputFocus = (errorStateSetter) => {
    errorStateSetter(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log form data for debugging
    console.log("Form Data:", formData);

    formData.name === "" ? setNameError(true) : setNameError(false);
    formData.email === "" || !validator.validate(formData.email)
      ? setEmailError(true)
      : setEmailError(false);
    formData.subject === "" ? setSubjectError(true) : setSubjectError(false);
    formData.message === "" ? setMessageError(true) : setMessageError(false);

    if (
      nameError ||
      emailError ||
      messageError ||
      subjectError ||
      !validator.validate(formData.email) ||
      formData.name === "" ||
      formData.email === "" ||
      formData.subject === "" ||
      formData.message === ""
    ) {
      setFormData({
        ...formData,
        email: "",
      });
      setSending(false);
      setFailed(true);
      return;
    }

    setSending(true);

    const data = JSON.stringify(formData);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);

        setSending(false);
        setSuccess(true);
        setFailed(false);
        setFormData({
          ...formData,
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Form Submission Error:", err);
        setSending(false);
        setFailed(true);
      });
  };

  const handleButtonText = () => {
    if (sending) {
      return "Please wait...";
    } else if (success) {
      return "Message Sent";
    } else if (
      failed ||
      nameError ||
      messageError ||
      emailError ||
      subjectError
    ) {
      return "Try again";
    } else {
      return "Send Message";
    }
  };

  return (
    <motion.form
      action="https://api.web3forms.com/submit"
      method="POST"
      ref={ref}
      className="contactForm"
      initial={{ y: "10vw", opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: "10vw", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onSubmit={handleSubmit}
    >
      <h2 className="contentTitle">Send a Message</h2>
      <br />
      <div
        className="col-12 col-md-6 formGroup"
        style={{ display: "inline-block" }}
      >
        <input
          type="text"
          className={`formControl ${nameError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setNameError);
          }}
          onChange={handleChange}
          value={formData.name}
          id="contactName"
          name="name"
          placeholder={`${nameError ? "Please enter your name" : "Name"}`}
          autoComplete="name"
        />
      </div>
      <div
        className="col-12 col-md-6 formGroup"
        style={{ display: "inline-block" }}
      >
        <input
          type="text"
          className={`formControl ${emailError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setEmailError);
          }}
          onChange={handleChange}
          value={formData.email}
          id="contactEmail"
          name="email"
          placeholder={`${emailError ? "Please enter a valid email" : "Email"}`}
          autoComplete="email"
        />
      </div>
      <div className="col-12 formGroup">
        <input
          type="text"
          className={`formControl ${subjectError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setSubjectError);
          }}
          onChange={handleChange}
          value={formData.subject}
          id="contactSubject"
          name="subject"
          placeholder={`${subjectError ? "Please enter a subject" : "Subject"}`}
          autoComplete="off"
        />
      </div>
      <div className="col-12 formGroup">
        <textarea
          className={`formControl ${messageError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setMessageError);
          }}
          onChange={handleChange}
          value={formData.message}
          name="message"
          id="contactMessage"
          rows="5"
          placeholder={`${messageError ? "Please enter a message" : "Message"}`}
          autoComplete="off"
        ></textarea>
      </div>
      <motion.div className="col-12 formGroup formSubmit">
        <Button
          name={handleButtonText()}
          disabled={
            nameError ||
            messageError ||
            emailError ||
            subjectError ||
            sending ||
            success
          }
        />
      </motion.div>
    </motion.form>
  );
};

export default Form;
