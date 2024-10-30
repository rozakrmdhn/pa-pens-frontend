import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export default function getAuthorizationHeader() {
    try {
        const currentUser = Cookies.get('currentUser'); // Ensure you access the `.value` of the cookie
        const accessToken = currentUser ? JSON.parse(currentUser).accessToken : "";

        if (!accessToken) {
            console.warn("No access token found.");
            return { Authorization: "" };
        }

        // Decode the JWT token
        const decodedToken = jwt.decode(accessToken) as { exp: number };

        // Check if the token is expired
        const isExpired = decodedToken && decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
            console.warn("Token has expired. Logging out...");
            Cookies.remove('currentUser');
            // Optionally, you might want to redirect the user to the login page here, depending on your app setup
            return { Authorization: "" };
        }
        
        return {
            Authorization: accessToken ? `Bearer ${accessToken}` : ""
        };
    } catch (error) {
        console.error("Failed to retrieve access token:", error);
        return { Authorization: "" };
    }
}