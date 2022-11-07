import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Login from "../Login/Login";
import TableauBord from "../TableauBord/TableauBord";
import Projets from "../Projets/Projets";
import Header from "../Header/Header";
import { authContexte } from "../../Contexte/authContexte";
import { useContext } from "react";


const App = () =>{
    const ctx = useContext(authContexte);
  console.log(ctx.user);
  const routes = !ctx.user ? [
	{
	  path: "/",
	  element: <Layout />,
      children: [
		{
		  index: true,
		  element: <Navigate to="/accueil" replace />,
		},
		{
		  path: "accueil",
		  element: <TableauBord />,
		},
        {
            path: 'creerprojet',
            element: <Projets/>
        }
	  ]
	},
	{
	  path: "*",
	  element: <Navigate to="/" replace />,
	},
  ] : [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              index: true,
              element: <Navigate to="/login" replace />,
            },
            {
              path: "login",
              element: <Login />,
            }
          ],
        },
        {
          path: "*",
          element: <Navigate to="/login" replace />,
        }];


  return (
    <RouterProvider router={createBrowserRouter(routes)}/>
  );
}
export default App;