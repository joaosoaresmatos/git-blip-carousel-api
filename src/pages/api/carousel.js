async function carousel(request, response) {


    const gitReposResponse = await fetch(`https://api.github.com/orgs/takenet/repos`);
    const gitReposResponseJson = await gitReposResponse.json();

    const sortByCreateDate = (repos) => {

        const sortedRepos = repos.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
        return sortedRepos;
    }

    const filterReposByLang = (repos, lang) => {
        
        const filteredRepos = repos.filter(obj => obj.language === lang);
        return filteredRepos;
    }

    const fillItem = (repos) => {

        const items = repos.map(obj => ({
            header: {
                type: "application/vnd.lime.media-link+json",
                value: {
                    title: obj.name,
                    text: obj.description,
                    type: "image/jpeg",
                    uri: obj.owner.avatar_url
                }
            },
            options: [
                {
                    label: {
                        type: "text/plain",
                        value: "Finalizar"
                    },
                    value: {
                        type: "application/json",
                        value: {
                            key1: "value1",
                            key2: 2
                        }
                    }
                }
            ]
        })
        );

        return items;

    }


    const createReposCarousel = (repos) => {

        return {
            itemType: "application/vnd.lime.document-select+json",
            items: fillItem(repos)

        }

    }


    const filtredRepos = sortByCreateDate(filterReposByLang(gitReposResponseJson, "C#")).slice(0, 5);
    const carousel = createReposCarousel(filtredRepos);

    response.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

    response.json(carousel);
}

export default carousel;