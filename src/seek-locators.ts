export const SEEK_LOCATORS = {
    // inputs
    keywords: '[data-automation="searchKeywordsField"] input',
    location: 'input[data-automation="SearchBar__Where"]',
    seekButton: 'button[data-automation="searchButton"]',

    // filters
    workTypeButton: `(//label[@data-automation="toggleWorkTypePanel"])//span[.='Type' or .='Full time' or .='Part time' or .='2 work types']`,
    workTypeOption: (type: string) => `//*[@aria-label="${type}"]`,
    refineBarClose: 'label[data-automation="refineBarToggleClose"]',

    // results
    totalJobsMessage: '[data-automation="totalJobsMessage"]',
};