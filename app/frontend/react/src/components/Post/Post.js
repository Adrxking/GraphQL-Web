import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client"

const PUBLISH_POST = gql`
  mutation Mutation($postId: ID!) {
    postPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`

const UNPUBLISH_POST = gql`
  mutation Mutation($postId: ID!) {
    postUnpublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {

  // Obtenemos la respuesta de la mutacion, publishPost es la funcion
  const [publishPost, {data, loading}] = useMutation(PUBLISH_POST)
  const [unpublishPost, {data: unpublishData, loading: unpublishLoading}] = useMutation(UNPUBLISH_POST)

  const formatedDate = new Date(Number(date));
  return (
    // Los posts que no estan publicados los cambiamos a un background rosa
    // Los posts no publicados les añadimos un boton de publicar
    // Los posts publicados les añadimos un boton de no publicar
    <div
    className="Post"
    style={published === false ? { backgroundColor: "hotpink" } : { backgroundColor: "cyan" }}
    >
      {isMyProfile && published === false && (
        <p className="Post__publish" onClick={() => {
          publishPost({
            variables: {
              postId: id
            }
          })
        }}>
          publish
        </p>
      )}
      {isMyProfile && (published === true || published === undefined) && (
        <p className="Post__publish" onClick={() => {
          unpublishPost({
            variables: {
              postId: id
            }
          })
        }}>
          unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
