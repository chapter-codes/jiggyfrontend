/* eslint-disable react/prop-types */
import {
  LiaCheckSolid,
  LiaGlobeSolid,
  LiaSchoolSolid,
  LiaTimesCircleSolid,
} from "react-icons/lia";
import axios from "../../../services/axios";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import _, { forIn } from "lodash";
import { BsCaretDownFill, BsImages, BsThreeDots } from "react-icons/bs";
import Spinner from "../../common/Spinner";
import { FaArrowRotateRight, FaSpinner } from "react-icons/fa6";
import { useErrorContext } from "../../../contexts/ErrorContext";
import Tick from '../../../assets/Tick.svg'

const CreatePostPage = ({
  setCreatePost,
  reloadPosts,
  setSelectedPost,
  selectedPostIndex,
  posts,
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading]= useState(false)
  const [post_type, setSelectedOption] = useState("Others");
  const [targeted_school, setTargetedSchool] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [previewImgSrcs, setPreviewImgSrcs] = useState();
  const [imageSrc, setImageSrc] = useState([]);
  const postBtn = useRef();
  const [error, setError] = useState("");
  const form = useRef();
  const {setAppError}= useErrorContext()

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
  };

  const handleBtnClick = (e, option) => {
    e.preventDefault();
    setSelectedOption(option);
  };

  const { key } = useContext(AuthContext);
  const headers = {
    Authorization: `Token ${key}`,
    "Content-Type": "multipart/form-data",
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (content) {
      setIsLoading(true);
      const formData = new FormData(form.current, postBtn.current);
      formData.append("content", content);
      formData.append("post_type", post_type);
      if (targeted_school.toLowerCase() !== "all")
        formData.append("school", targeted_school.toUpperCase());
      imageSrc[0] && formData.append("images", imageSrc[0]);
      try {
        await axios.post("annon/posts/create/", formData, { headers });
        await reloadPosts();
        setSelectedPost(posts[selectedPostIndex]);
        setIsLoading(false);
        setCreatePost(false);
        setAppError(null)
        // setAppError(false)

      } catch (error) {
        setIsLoading(false);
        console.log(error)
        if(error.message=='Network Error'){
          setAppError(error)
        }
        if (error.code === "ERR_BAD_RESPONSE") {
          setError("server error");
        }
        console.log(error.status);
        // setAppError(error)
      }
    } else {
    }
  };
  useEffect(() => {
    window.onclick = (e) => {
      !e.target.classList.contains("school_btn") &&
        openDropdown &&
        setOpenDropdown(false);
    };
  });
  const handlePreviewImg = (e) => {
    const files = e.target.files;
    let maxAllowedSize = 3 * 1024 * 1024;
    if (files[0].size < maxAllowedSize) {
      setImageSrc([files[0]]);
      setPreviewImgSrcs(URL.createObjectURL(files[0]));
    } else {
      alert("image is too large");
    }
  };
  const handleRemoveImage = () => {
    setPreviewImgSrcs("");
    setImageSrc("");
  };
  function reset(){
    setAppError(null)
    setError(null)
  }

  // const handlePost= ()=>{
  //     const data = { content , post_type }
  //     if (socket && socket.readyState === WebSocket.OPEN) {
  //         socket.send(data)
  //         // .then((response)=>console.log(response))
  //         // .catch((err)=>console.log(err))
  //         setCreatePost(false)
  //     }
  // }
  const throttledApiRequest = _.throttle(handlePost, 3500);
  if (error === "server error") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <p>Ooops, Server Error</p>
          <a href="#" className="text-blue-500 flex items-center gap-2" onClick={reset}>
          <FaArrowRotateRight />
            Try Again
          </a>
        </div>
      </div>
    );
  }
  return (
    <form
      ref={form}
      onSubmit={throttledApiRequest}
      className="flex flex-col w-full pb-6 h-screen bg-[#000]"
    >
      <div className="pt-8">
        <div className="flex justify-between items-center px-5  pb-2 border-b border-[#9E9898] align-center">
          <LiaTimesCircleSolid
            size="20"
            color="#F33F5E"
            cursor="pointer"
            onClick={() => {
              setCreatePost(false);
            }}
          />
          <p className="font-bold text-xs  font-openSans">Create an anonymous post</p>
          <button 
            onSubmit={throttledApiRequest}
            type="submit"
            ref={postBtn}
            disabled={isLoading}
          >
            {
              !isLoading?
              <img src={Tick} alt='create post' />
              :<FaSpinner size={"1.5rem"} className="animate-spin" />
            }

          </button>
          {/* <button


            className={`text-[#F33F5E] text-lg ${
              !isLoading && "bg-white"
            } font-bold transition-all duration-300 px-3 rounded-lg ${
              !content
                ? "opacity-50"
                : "opacity-1 hover:bg-[#F33F5E] hover:text-white"
            }`}
            onSubmit={throttledApiRequest}
            type="submit"
            ref={postBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner size={"1.5rem"} className="animate-spin" />
            ) : (
              "Post"
            )}
          </button> */}
        </div>
        <div>
          <button
            name="post_type"
            className={`${post_type} rounded-full px-2 mx-3 mt-3 mb-1 text-sm border-[1px]`}
          >
            {post_type}
          </button>
          <div className="inline-block">
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex school_btn items-center gap-2  rounded-2xl border-[1px] px-2 "
              >
                <span className="font-semibold text-sm  school_btn">
                  {targeted_school}
                </span>
                <span className="school_btn">
                  <BsCaretDownFill className="school_btn" />
                </span>
              </button>
              <div
                className={`shadow-[0_0_3px_0px_#fff] rounded-lg mt-2 absolute w-[13rem] z-10 bg-[#321616] ${
                  openDropdown ? "block" : "hidden"
                }`}
              >
                <h5 className="font-bold text-lg mb-2 px-4 pt-4">
                  Choose audience
                </h5>
                <button
                  onClick={() => setTargetedSchool("All")}
                  className="flex w-full text-lg py-2 px-4 transition duration-300 gap-4 my-1 items-center hover:bg-[#ffffff32]"
                >
                  <span>
                    <LiaGlobeSolid />
                  </span>
                  <span className="font-semibold">All</span>
                  {targeted_school === "All" && (
                    <span className="ml-auto font-semibold">
                      <LiaCheckSolid />
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTargetedSchool("FUTO")}
                  className="flex w-full text-lg py-2 px-4 transition duration-300 gap-4 my-1 items-center hover:bg-[#ffffff32]"
                >
                  <span>
                    <LiaSchoolSolid />
                  </span>
                  <span className="font-semibold">FUTO</span>
                  {targeted_school === "FUTO" && (
                    <span className="ml-auto font-semibold">
                      <LiaCheckSolid />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-input grow">
        <textarea
          name="content"
          value={content}
          spellCheck={false}
          onChange={handleTextareaChange}
          placeholder="Secret crush ? Confession ? Share ? what's on your mind...."
          className="focus:outline-none text-sm font-ibmPlexSans post-placeholder placeholder:font-comicSans placeholder:text-base min-h-[150px]"
        ></textarea>
      </div>
     
      <footer className="">
        <div className="px-5">
          <output className="flex gap-2">
            {previewImgSrcs && (
              <figure
                style={{ backgroundImage: `url(${previewImgSrcs})` }}
                className={` transition-all duration-300 ease-linear aspect-[12/16] bg-cover bg-center rounded-lg w-[5rem] h-[7rem] relative`}
              >
                <LiaTimesCircleSolid
                  onClick={() => handleRemoveImage()}
                  className="absolute cursor-pointer hover:text-lg transition-all duration-300 ease-linear bg-[#321616] rounded-full top-1 right-1"
                />
              </figure>
            )}
          </output>
        </div>

        <div className="px-3 flex gap-1 flex-wrap">
          <button
            className="Confession rounded-full text-xs border-[1px] my-2 px-2 "
            onClick={(e) => handleBtnClick(e, "Confession")}
          >
            Confession
          </button>
          <button
            className="Question rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Question")}
          >
            Question
          </button>
          <button
            className="Crush rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Crush")}
          >
            Crush
          </button>
          <button
            className="DM rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "DM")}
          >
            DM
          </button>
          <button
            className="Advice rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Advice")}
          >
            Advice
          </button>
          <button
            className="Cruise rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Cruise")}
          >
            Cruise
          </button>
          <button
            className="Talk rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Talk")}
          >
            Talk
          </button>
          <button
            className="Others rounded-full px-2 text-xs border-[1px] my-2"
            onClick={(e) => handleBtnClick(e, "Others")}
          >
            Others
          </button>
        </div>
        <div className="px-5 mt-2">
          <label
            className="cursor-pointer  transition-all duration-300 ease-linear"
            htmlFor="imageUpload"
          >
            <BsImages color="#F33F5E" size={"2rem"} />
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            name="image"
            multiple={true}
            onChange={(e) => handlePreviewImg(e)}
          />
        </div>
      </footer>
    </form>
  );
};

export default CreatePostPage;
