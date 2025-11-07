import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ProductTable from "../../components/products/ProductTable";

const Products = () =>  {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All Products" />
      <div className="space-y-6 ">
        {/* <ComponentCard title="All Languages"> */}
          <ProductTable/>
        {/* </ComponentCard> */}
      </div>
    </>
  );
}


export default Products