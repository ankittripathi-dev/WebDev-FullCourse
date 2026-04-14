import React from "react";
import Card from "./components/Card";

const App = () => {
  const users = [
    {
      name: "Bill Gates",
      age: 69,
      city: "Washington",
      profession: "Businessman",
      profilePhoto:
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSLoBEMGqaqYRvbC4_C3GN28Jt49F2PAPo2LOq9eYEIAirrTZhSLKzAPVbr3lHWzViRMyt9waAwSIFPoy0d2s57-A",
    },

    {
      name: "Michael Smith",
      age: 34,
      city: "Los Angeles",
      profession: "Graphic Designer",
      profilePhoto:
        "https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    {
      name: "Priya Sharma",
      age: 27,
      city: "Mumbai",
      profession: "Content Writer",
      profilePhoto:
        "https://media.istockphoto.com/id/1278659427/photo/young-woman-sitting-at-sofa-stock-photo.jpg?s=2048x2048&w=is&k=20&c=q0hpSwCS0juhwNo4tVLW3AKpq-RyRm5axU74WYebowM=",
    },

    {
      name: "Liam Brown",
      age: 41,
      city: "Chicago",
      profession: "Marketing Manager",
      profilePhoto:
        "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    {
      name: "Sophia Gonzalez",
      age: 23,
      city: "Madrid",
      profession: "Freelance Photographer",
      profilePhoto:
        "https://images.unsplash.com/photo-1531498681050-acee0b4825a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYXV0aWZ1bHxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <div>
      <div className="p-10 ml-10">
        {users.map((elem, index) => {
          return (
            <Card
              key={index}
              user={elem.name}
              city={elem.city}
              age={elem.age}
              prof={elem.profession}
              photo={elem.profilePhoto}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
