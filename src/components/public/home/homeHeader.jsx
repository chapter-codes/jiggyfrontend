/* eslint-disable react/prop-types */
import profile_pic from '../../../assets/profile_pics/pic1.png'

const HomeHeader = ({ setProfilePage }) => {
    return (
      <div className='flex items-center pt-6'>
        <div onClick={()=>setProfilePage(true)}>
          <img className='w-14 rounded-full mx-[9px]' src={profile_pic} />
        </div>
        <h1 className='text-3xl text-center font-bold from-[#f33f5e] via-[#ff008a9e] to-[#b416fe66] bg-gradient-to-r bg-clip-text text-transparent'>Home</h1>
      </div>
    )
  }
  
  export default HomeHeader