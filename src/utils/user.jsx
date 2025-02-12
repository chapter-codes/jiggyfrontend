import axios from 'axios'

export async function getPosts({queryKey:[, currentPageIndex]}){
  const response = await axios.get(`annon/posts/paginated/?page=${currentPageIndex}`);
  return response
}

export async function getUser({queryKey:[, key]}){
  const headers = {
      Authorization: `Token ${key}`,
    };
    const userDetails = await axios.get("account/annonyuser/", {headers})
  return userDetails
}

export async function getNotifications({queryKey:[, key]}){
  const url='https://jiggybackend.com.ng/annon/notifications/view/?page=1'
  const headers = {
    Authorization: `Token ${key}`,
  };

	const response = await axios.get(url,{headers})
	return response
}


