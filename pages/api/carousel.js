async function carousel(request, response) {


    const gitReposResponse = await fetch(`https://api.github.com/orgs/takenet/repos`);
    const gitReposResponseJson = await gitReposResponse.json();

    const sortByCreateDate = (repos) =>{
        const sortedRepos = repos.sort((a,b) => Date(b.created_at).getTime() - Date(a.created_at).getTime());
        return sortedRepos;
    }

    const filterReposByLang = (repos, lang) => {
        // filter the repos by lang
        const filteredRepos = repos.filter(obj => obj.language === lang);

        return filteredRepos;
    }
    
    const createReposCarousel = (repos, numContent) => {
    }

    
    const repos = filterReposByLang(gitReposResponseJson,"C#");
    

    response.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

    response.json(repos);
}

export default carousel;