import Script from "next/script";

export const metadata = {
  title: "ContactPage - Facebook",
  description: "This is Contact Facebook Page",
};

const ContactPage = () => {
  return (
    <div>
      {/* Script Components */}
      <Script>{`alert('Welcome to Contact Page')`}</Script>
      <Script>{`console.warn('Stay away from Danger')`}</Script>
      <h1 className="text-center text-2xl">Contact Page</h1>
    </div>
  );
};

export default ContactPage;
