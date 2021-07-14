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

export default function Home() {
  const githubUser = 'deleit';

  const [comunidades, setComunidades] = React.useState([{
    id: '12312415123',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }, {
    id: '12315124',
    title: 'Anão vestido de palhaço mata 8',
    image: 'https://img10.orkut.br.com/community/f51212ffdbeab26effb3793dfe1b2135.jpg'
  }, {
    id: '12315124',
    title: 'Cabras não tem muitas ambições',
    image: 'https://img10.orkut.br.com/community/99265afeff3b5c002ecf9e29506e015b.png'
  }, {
    id: '12312312414',
    title: 'Se eu Morrer Minha Mãe me Mata',
    image: 'https://img10.orkut.br.com/community/2c89c09d9ddec38f6a874e3ca58d9135.jpg'
  }, {
    id: '123123141',
    title: 'ALL STAR bom é ALL STAR sujo!',
    image: 'https://i.pinimg.com/originals/2b/a6/cc/2ba6cc84f8f67f8adff0a1facab16355.jpg'
  }

  ]);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'deleit',
    'steppat'
  ]

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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              }

              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas)
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
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`https://github.com/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <a className="boxLink" href={`https://github.com/${githubUser}?tab=followers`}>Ver todas</a>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map(($itemAtual) => {
                return (
                  <li key={$itemAtual.id}>
                    <a href={`/users/${$itemAtual.title}`}>
                      <img src={$itemAtual.image} />
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
