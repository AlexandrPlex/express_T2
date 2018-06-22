export default function protectedPage (username, role) {
	return (`<h1> Protected </h1>
			 <p>User name: ${username}</p>
			 <p>User role: ${role}</p>
		
			  `);
}