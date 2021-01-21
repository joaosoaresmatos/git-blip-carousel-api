const carousel = async (request, response) => {
    const NUM_ITEMS = 5;
    const LANG = "C#";

    const takeReposResponse = await fetch(`https://api.github.com/orgs/takenet/repos`);
    const takeReposResponseJson = await takeReposResponse.json();

    const filteredRepos = filterReposByLang(takeReposResponseJson, LANG);
    const sortedRepos = sortReposByCreatedDate(filteredRepos);
    const carousel = createCarouselFromRepos(sortedRepos.slice(0, NUM_ITEMS));

    response.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
    response.json(carousel);
}

const filterReposByLang = (repos, lang) => repos.filter(obj => obj.language === lang);

const sortReposByCreatedDate = (repos) => repos.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

const createCarouselFromRepos = (repos) => ({
    itemType: "application/vnd.lime.document-select+json",
    items: fillItems(repos),
});

const fillItems = (repos) => repos.map(obj => ({
    header: createItemHeader(obj),
    options: createItemOptions(),
}));

const createItemHeader = ({ name, description, owner: { avatar_url } }) => ({
    type: "application/vnd.lime.media-link+json",
    value: {
        title: name,
        text: description,
        type: "image/jpeg",
        uri: avatar_url,
    },
});

const createItemOptions = () => [
    {
        label: {
            type: "text/plain",
            value: "Finalizar",
        },
        value: {
            type: "application/json",
            value: {
                key1: "value1",
                key2: 2,
            },
        },
    },
];

export default carousel;