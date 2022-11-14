import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Login from "../Login/Login";
import TableauBord from "../TableauBord/TableauBord";
import CreerProjets from "../Projets/CreerProjets";
import Membres from "../Membres/Membres";
import CreerClient from "../Client/CreerClient";
import DetailsClient from "../Client/DetailsClient";
import Header from "../Header/Header";
import { authContexte } from "../../Contexte/authContexte";
import { useContext } from "react";


const App = () =>{
  const ctx = useContext(authContexte);

  const routes = ctx.user ? [
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
      element: <CreerProjets/>
    },
    {
      path: 'membres',
      element: <Membres/>
    },
    {
      path: 'creerprojet',
      element: <CreerProjets/>
    },
    {
      path: 'creerClient',
      element: <CreerClient/>
    },
    {
      path: 'detailsClient',
      element: <DetailsClient/>
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