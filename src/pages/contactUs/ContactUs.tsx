import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta.tsx";
import ContactUsTable from "../../components/contactUs/ContactUsTable.tsx";

const ContactUs = () =>  {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Contact Us" />
      <div className="space-y-6">
        {/* <ComponentCard title="All Languages"> */}
          <ContactUsTable/>
        {/* </ComponentCard> */}
      </div>
    </>
  );
}


export default ContactUs