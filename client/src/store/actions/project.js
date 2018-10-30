import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_PROJECTS } from '../actionTypes';

export const loadProjects = projects => ({
    type: LOAD_PROJECTS,
    projects
});

export function createProject(projectData) {
    // return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('post', `/api/hub/group/${projectData.groupid}/project`, projectData)
                .then(res => {
                    // console.log(res);
                    resolve(res);
                })
                .catch(error => {
                    // addError(error.message);
                    reject(error);
                });
        });
    // };
}

export function deleteProject(groupid, projectid) {
    return new Promise((resolve, reject) => {
        return apiCall('delete', `/api/hub/group/${groupid}/project/${projectid}`)
            .then(res => {
                console.log(res);
                resolve(res);
            })
            .catch(error => {
                // addError(error.message);
                reject(error);
            });
    });
}


// fetches the projects for the current group - DEPRECATED
export const fetchProjects = (groupid) => {
    return dispatch => {
        return apiCall('get', `/api/hub/group/${groupid}/projects`)
            .then(res => {
                console.log("group's projects loaded!");
                console.log(res);
                dispatch(loadProjects(res));
            })
            .catch((err) => {
                console.log('user groups error!');
                if(err) {
                    dispatch(addError(err.message));
                    console.log(err.message);
                } else {
                    console.log('projects: no error found?');
                }
            });
    };
};