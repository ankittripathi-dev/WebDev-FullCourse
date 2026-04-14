/* Condition:1 { cache: "no-store" }
const Home = async () => {
  let data = await fetch("https://api.vercel.app/blog", { cache: "no-store" });
  let posts = await data.json();
  console.log(posts);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <p>
            {post.id} {post.title}
          </p>
        </li>
      ))}
    </ul>
  );
};
export default Home;

Notes:  
- fetch() by default response ko cache karta hai, Isliye API baar-baar network se call nahi hoti
- Agar hum cache:"no-store" use karte hain, toh API har request par fresh call hoti hai.
*/

/******************************************************************************/

/*
//  Condition:2 { next: { revalidate: 3600 } }
const Home = async () => {
  let data = await fetch("https://api.vercel.app/blog", {
    next: { revalidate: 3600 },
  });
  let posts = await data.json();
  console.log(posts);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <p>
            {post.id} {post.title}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Home;

// Notes:
// - 3600 seconds (1 hour) ke baad cache revalidate hota hai
// - next: { revalidate: 3600 } means:- data 3600 seconds ke baad revalidate hoga.
// - next request par fresh data background me fetch hota hai.
// - Page auto-refresh nahi hota,
// - npm run build krne pe: page static page ke roop me build ho jaega
*/


/****************************************************************************/
//  Condition:3 { next: { revalidate: 3600 } }
const Home = async () => {
  let data = await fetch("https://api.vercel.app/blog", {
    next: { revalidate: 3600 },
  });
  let posts = await data.json();
  console.log(posts);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <p>
            {post.id} {post.title}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Home;
export const dynamic = 'force-dynamic'
// Notes:
// - npm run build : page dynamic page ke roop me rendr hoga
// - Eska matalb page ko cache mat kro, Mere Es page ko har baar fetch kr ke dikhawo. 
