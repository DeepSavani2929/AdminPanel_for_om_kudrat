import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LanguageTable from "../../components/languages/LanguageTable.tsx";
import OrderTable from "../../components/orders/OrderTable.tsx";

const Orders = () =>  {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All Orders" />
      <div className="space-y-6 ">
        {/* <ComponentCard title="All Languages"> */}
          <OrderTable/>
        {/* </ComponentCard> */}
      </div>
    </>
  );
}


export default Orders