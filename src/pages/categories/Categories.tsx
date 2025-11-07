import CategoriesTable from "../../components/categories/CategoriesTable.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LanguageTable from "../../components/languages/LanguageTable.tsx";

const Categories = () =>  {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All Categories" />
      <div className="space-y-6">
        {/* <ComponentCard title="All Languages"> */}
          <CategoriesTable/>
        {/* </ComponentCard> */}
      </div>
    </>
  );
}


export default Categories