// Dummy store file to fix Vite imports for Admin and Public pages
// These pages were static and will be migrated to the real API later.

export const addPublicMessage = (form) => console.log('Mock: addPublicMessage', form);
export const getPublicTeam = () => [];
export const addPublicTeamMember = () => {};
export const updatePublicTeamMember = () => {};
export const deletePublicTeamMember = () => {};

export const getMatchById = (id) => null;

export const getUsers = () => [];
export const addUser = () => {};
export const updateUser = () => {};
export const deleteUser = () => {};

export const getPublicMessages = () => [];
export const deletePublicMessage = () => {};
export const markPublicMessageRead = () => {};
