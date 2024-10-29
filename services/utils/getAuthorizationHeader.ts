import Cookies from 'js-cookie';

export default function getAuthorizationHeader() {
    try {
        const currentUser = Cookies.get('currentUser'); // Ensure you access the `.value` of the cookie
        const accessToken = currentUser ? JSON.parse(currentUser).accessToken : "";
        
        return {
            Authorization: accessToken ? `Bearer ${accessToken}` : ""
        };
    } catch (error) {
        console.error("Failed to retrieve access token:", error);
        return { Authorization: "" };
    }
}