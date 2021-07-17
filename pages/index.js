import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  let seeMoreUrl = "#"
  if (propriedades.title == "Seguindo") {
    seeMoreUrl = `https://github.com/${propriedades.githubUser}?tab=following`
  } else if (propriedades.title == "Seguidores") {
    seeMoreUrl = `https://github.com/${propriedades.githubUser}?tab=followers`
  }
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.login}`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <a className="boxLink" href={`${seeMoreUrl}`}>Ver todas</a>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home() {
  const githubUser = 'deleit';
  const [comunidades, setComunidades] = React.useState([]);

  //get followers
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      setSeguidores(respostaCompleta);
    })
  }, [])

  //get following
  const [seguindo, setSeguindo] = React.useState([]);
  
  React.useEffect(function() {
    // GET
    fetch(`https://api.github.com/users/${githubUser}/following`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta) {
      setSeguindo(respostaCompleta);
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '90459c92154f6f7b74ab16184f54a8',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorslug
        }
      }`
      })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
  }, [])

  

  return (
    <>  
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a), {githubUser}
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorslug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })
            }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa"
                name="image"
                aria-label="Coloque uma URL para usarmos de capa"
              />
            </div>

            <button>
              Criar comunidade
            </button>
            </form>
          </Box>
        </div>
        
        <div className="profileRelaionsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} githubUser={githubUser} />
          
          <ProfileRelationsBox title="Seguindo" items={seguindo} githubUser={githubUser} />
          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map(($itemAtual) => {
                return (
                  <li key={$itemAtual.id}>
                    <a href={`/communities/${$itemAtual.id}`}>
                      <img src={$itemAtual.imageUrl} />
                      <span>{$itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <a className="boxLink" href="#">Ver todas</a>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
