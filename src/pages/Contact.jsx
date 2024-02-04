import Form from "../components/Form";

/**
 * Represents the Contact page component.
 * Displays a contact form and contact information side by side.
 *
 * @component
 * @param {string} name - The name of the contact person.
 * @param {string} email - The email address of the contact person.
 * @param {string} location - The location of the contact person.
 */

const Contact = () => {
  return (
    <>
      {/* Main Contact Page */}
      <main className="contact container">
        <div className="contactWrap container">
          <div className="row">
            {/* Display the contact form */}
            <div className="col-12 col-lg-6 ">
              <Form />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
