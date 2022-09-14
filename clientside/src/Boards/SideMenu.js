import { Drawer, Typography, Divider, Link, Grow } from "@mui/material";
import Clear from "@material-ui/icons/Clear";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import "./sidemenu.css";
import axios from "axios";
import { useParams } from "react-router-dom";
const colors = [
  "#fafa",
  "#fff",
  "#047db1",
  "#64e4db",
  "#040b25",
  "#002A54",
  "#041434",
  "#2a4d69",
  "#6d7b8d",
  "#ebd197",
  "#cd7f32",
  "#c04000",
  "#757575",
  "#94a8c1",
  "#323642",
  "#2e9674",
  "#86d0a9",
  "#f5cdcd",
  "#fff2e1",
  "#d4b4db",
];
const images = [
  "/Images/1.jpg",
  "/Images/2.jpg",
  "/Images/3.jpg",
  "/Images/4.jpg",
  "/Images/5.jpg",
  "/Images/6.jpg",
  "/Images/7.jpg",
  "/Images/8.jpg",
  "/Images/9.jpg",
  "/Images/12.jpg",
  "/Images/10.jpg",
  "/Images/11.jpg",
];
const SideMenu = ({ openSideNav, setOpenSideNav, setColor }) => {
  const { bid } = useParams();
  const [showMedia, setShowMedia] = useState("");

  // make function to map photos

  const handleSelectColor = (color) => {
    // console.log(color);
    setOpenSideNav(false);
    setColor(color);
    axios
      .put("/myboards/updatecolor", { bid: bid, color: color })
      .then((rec) => console.log("Success"))
      .catch((err) => console.log(err));
  };

  //   useEffect(() => {
  //     const page = Math.floor(Math.random() * 20 + 1);
  //     axios
  //       .get(
  //         "https://api.unsplash.com/search/photos?page=${page}&query=Landscape&client_id=GGgD6sv-DPJWLCuu0btf1P0DQ8qoHVdfVpIjHf36hL4"
  //       )
  //       .then((rec) => {
  //         console.log(rec.data.results);
  //         setPhotos(rec.data.results);
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);
  return (
    <div>
      <Drawer
        openSecondary={true}
        open={openSideNav}
        anchor={"right"}
        onClose={() => setOpenSideNav(false)}
        PaperProps={{
          sx: { width: "400px", backgroundColor: "#e1c5ff" },
        }}
      >
        <div className="titleContainer">
          <Typography className="title">Change Background</Typography>
          <Clear onClick={() => setOpenSideNav(false)} />
        </div>
        <Divider />

        <div className="menuContainer">
          <div
            className="menu"
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/755726/pexels-photo-755726.jpeg?cs=srgb&dl=astronomy-astrophotography-clouds-colors-755726.jpg&fm=jpg)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowMedia("Images");
            }}
          >
            <span style={{ fontSize: "30px" }}>photo</span>
          </div>
          <div
            className="menu"
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/226589/pexels-photo-226589.jpeg?cs=srgb&dl=closeup-photo-of-multi-color-stick-226589.jpg&fm=jpg)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowMedia("Colors");
            }}
          >
            <span style={{ fontSize: "30px" }}>color</span>
          </div>
        </div>
        {showMedia == "Colors" && (
          <Grow in={showMedia == "Colors"}>
            <div className="optionContainer">
              {colors.map((color, index) => {
                return (
                  <div
                    key={index}
                    className="box"
                    style={{ backgroundColor: color }}
                    onClick={() => handleSelectColor(color)}
                  ></div>
                );
              })}
            </div>
          </Grow>
        )}
        {showMedia == "Images" && (
          <Grow in={showMedia == "Images"}>
            <div
              style={{ height: showMedia == "Images" ? null : 0 }}
              className="menuContainer"
            >
              {images?.map((photo, index) => (
                <div
                  key={index}
                  className="menu"
                  style={{
                    backgroundImage: `url(${photo})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                  onClick={() => handleSelectColor(photo)}
                ></div>
              ))}
            </div>
          </Grow>
        )}
      </Drawer>
    </div>
  );
};

export default SideMenu;
