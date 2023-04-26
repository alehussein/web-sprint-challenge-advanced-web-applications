import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate, Router } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios'
import axios from 'axios'
import PrivateRoutes from '../axios/PrivateRoutes'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)



  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('"Goodbye!"');
    navigate('/');
  }


  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
    axios.post(loginUrl, { username, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch(() => {
        // console.log(err).log
        setSpinnerOn(false);
      })
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(err.response.message);
        }
        setSpinnerOn(false);
      });
  }

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then(res => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(err.response.message);
        }
        setSpinnerOn(false);
      })
  }

  const updateArticle = ({ article }) => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article.article_id}`, article)
      .then(res => {
        const updateArticles = articles.map(a => {
          if (a.article_id === article.article_id) {
            return (res.data.article);
          } else {
            return a;
          }
        });
        setArticles(updateArticles);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage('Update');
        }
        setSpinnerOn(false);
      });
  }

  const deleteArticle = article_id => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        const updatedArticles = articles.filter(a => a.article_id !== article_id);
        setArticles(updatedArticles);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(err.response.message);
        }
        setSpinnerOn(false)
      })
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route element={<PrivateRoutes />}>
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} articles={articles} />
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} />
            </>
          } />
          </Route>
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
