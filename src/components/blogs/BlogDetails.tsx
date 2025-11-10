import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { CircleChevronLeft } from "lucide-react";

const BlogDetails = () => {
  const { blogSlug } = useParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blog, setBlog] = useState({
    blogTitle: "",
    shortDescription: "",
    blogImage: null as File | null,
    content: "",
  });
  const [oldImage, setOldImage] = useState<string>(""); 
  const [preview, setPreview] = useState<string>(""); 

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };


  const validate = () => {
    const error: Record<string, string> = {};

    if (!blog.blogTitle.trim()) {
      error.blogTitle = "Blog title is required.";
    }

    if (!blog.shortDescription.trim()) {
      error.shortDescription = "Short description is required.";
    }

    if (!blog.blogSlug) {
      error.blogSlug = "Slug for the blog is required.";
    }

    if (!blogSlug && !blog.blogImage) {
      error.blogImage = "Blog image is required.";
    }

   const cleanContent = blog.content
    .replace(/<(.|\n)*?>/g, "")
    .replace(/&nbsp;/g, "")    
    .trim();

  if (!cleanContent) {
    error.content = "Content cannot be empty.";
  }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  useEffect(() => {
    if (blogSlug) getBlog();
  }, [blogSlug]);

  const getBlog = async () => {
    try {
      const res = await axiosInstance.get(`/blog/getBlog/${blogSlug}`);

      if (res.data.success) {
        const blogData = res.data.data;
        setBlog({
          blogTitle: blogData.blogTitle || "",
          shortDescription: blogData.shortDescription || "",
          content: blogData.content || "",
          blogSlug: blogData.blogSlug || "", 
           blogImage: null,
        });

setOldImage(blogData.blogImage || "");
setPreview(
  blogData.blogImage
    ? `http://localhost:8000/images/${blogData.blogImage}`
    : ""
);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  const handleOnChange = (e: any) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setBlog((prev) => ({ ...prev, blogImage: file }));

      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setPreview(fileUrl);
      }
    } else {
      setBlog((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuillChange = (content: string) => {
    setBlog((prev) => ({ ...prev, content }));
    console.log(blog)
  };

  const handlePublish = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("blogTitle", blog.blogTitle);
      formData.append("shortDescription", blog.shortDescription);
      formData.append("content", blog.content);
      formData.append("blogSlug", blog.blogSlug);


      if (blog.blogImage) {
        formData.append("blogImage", blog.blogImage);
      } else if (oldImage) {
        formData.append("oldImage", oldImage); 
      }

      let res;
      if (blogSlug) {
        res = await axiosInstance.put(`/blog/updateBlog/${blogSlug}`, formData);
      } else {
        res = await axiosInstance.post("/blog/createBlog", formData);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setBlog({
          blogTitle: "",
          shortDescription: "",
          blogImage: null,
          content: "",
        });
        setPreview("");
        navigate("/blogs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <PageBreadcrumb pageTitle="All Blogs  " />
        <div className="rounded-2xl border  mx-auto border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          {blogSlug ? "Edit Blog" : "Add New Blog"}
        </h3>
         <CircleChevronLeft className="w-12 h-12 text-brand-500 cursor-pointer " onClick = {() =>  navigate("/blogs")} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6 ">

    
          <div className="flex flex-col gap-y-1">
            <label className="font-medium dark:text-gray-400 ">Title</label>
            <input
              type="text"
              name="blogTitle"
              value={blog.blogTitle}
              onChange={handleOnChange}
              className={`border-2 rounded-lg py-2 px-3 dark:text-gray-400  ${
                errors.blogTitle ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter blog title"
            />
            {errors.blogTitle && (
              <p className="text-red-500 text-sm">{errors.blogTitle}</p>
            )}
          </div>

            <div className="flex flex-col gap-y-1">
            <label className="font-medium dark:text-gray-400 ">Slug</label>
            <input
              type="text"
              name="blogSlug"
              value={blog.blogSlug}
              onChange={handleOnChange}
              className={`border-2 rounded-lg py-2 px-3 dark:text-gray-400  ${
                errors.blogTitle ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter blog title"
            />
            {errors.blogTitle && (
              <p className="text-red-500 text-sm">{errors.blogSlug}</p>
            )}
          </div>

      
          <div className="flex flex-col gap-y-1">
            <label className="font-medium dark:text-gray-400 ">Description</label>
            <input
              type="text"
              name="shortDescription"
              value={blog.shortDescription}
              onChange={handleOnChange}
              className={`border-2 rounded-lg py-2 px-3 dark:text-gray-400  ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter short description"
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-sm">{errors.shortDescription}</p>
            )}
          </div>

     
          <div className="flex flex-col gap-y-2">
            <label className="font-medium dark:text-gray-400 ">Blog Image</label>
            <input
              type="file"
              name="blogImage"
              accept="image/*"
              onChange={handleOnChange}
              className={`border-2 rounded-lg py-2 px-3 dark:text-gray-400 ${
                errors.blogImage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.blogImage && (
              <p className="text-red-500 text-sm">{errors.blogImage}</p>
            )}

         
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-lg border"
                />
              </div>
            )}
          </div>


          <div>
            <label className="font-medium mb-1 block dark:text-gray-400 ">Content</label>
            <ReactQuill
              theme="snow"
              value={blog.content || ""}
              onChange={handleQuillChange}
              modules={modules}
              placeholder="Write your blog content here..."
              className={`rounded-lg bg-white dark:text-gray-400  ${
                errors.content ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

       
          <div className="flex justify-end">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
            >
              {loading ? "Publishing..." : blogSlug ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    </>

  );
};

export default BlogDetails;
