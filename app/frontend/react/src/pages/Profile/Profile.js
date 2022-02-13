import React from "react";
import { useParams } from "react-router";
import AddPostModal from "../../components/AddPostModal/AddPostModal";
import Post from "../../components/Post/Post";
import { gql, useQuery } from "@apollo/client"

const GET_PROFILE = gql`
  query Profile($userId: ID!) {
    profile(userId: $userId) {
      id
      bio
      isMyProfile
      user {
        id
        name
        posts {
          id
          title
          content
          createdAt
          published
        }
      }
    }
  }
`

export default function Profile() {
  // Obtener el parametro id del enlace
  const { id } = useParams();

  const { data, error, loading } = useQuery(GET_PROFILE, {
    variables: {
      userId: id,
    }
  });

    // Devolver el error si existe
    if(error) return <div>Error</div>
  
    // Devolver pagina de cargando mientras cargan los datos
    if(loading) return <div>Cargando</div>

    const { profile } = data


  return (
    <div>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex ",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>{profile.user.name}</h1>
          <p>{profile.bio}</p>
        </div>
        <div>{profile.isMyProfile ? <AddPostModal /> : null}</div>
      </div>
      <div>
        {profile.user.posts.map(post => {
              return <Post 
              key={post.id}
              title={post.title} 
              content={post.content} 
              date={post.createdAt} 
              id={post.id} 
              user={profile.user.name}
              published={post.published}
              isMyProfile={profile.isMyProfile}
            />
        })}
      </div>
    </div>
  );
}
