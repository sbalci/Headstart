/**
 * This is where all actions are stored.
 */

export const zoomIn = (selectedAreaData, source = null) => ({
  type: "ZOOM_IN",
  selectedAreaData,
  // TODO remove this when whole app is refactored
  not_from_mediator: true,
  source,
});

export const zoomInFromMediator = (selectedAreaData) => ({
  type: "ZOOM_IN",
  selectedAreaData,
});

export const zoomOutFromMediator = () => ({
  type: "ZOOM_OUT",
});

export const zoomOut = (callback) => ({
  type: "ZOOM_OUT",
  // TODO remove this when whole app is refactored
  not_from_mediator: true,
});

/**
 * Action for initializing the data that aren't known in advance.
 * @param {Object} configObject the default_config.json + data_config.json
 * @param {Object} contextObject the app context
 * @param {Array}  dataArray the papers data
 */
export const initializeStore = (configObject, contextObject, dataArray) => ({
  type: "INITIALIZE",
  configObject,
  contextObject,
  dataArray,
});

/**
 * Action for changing the local file.
 * @param {Number} fileIndex
 */
export const changeFile = (fileIndex) => ({
  type: "FILE_CLICKED",
  fileIndex,
});

export const toggleList = () => ({
  type: "TOGGLE_LIST",
});

export const showList = () => ({
  type: "SHOW_LIST",
});

export const search = (text) => ({
  type: "SEARCH",
  text,
});

export const filter = (id) => ({
  type: "FILTER",
  id,
});

export const sort = (id) => ({
  type: "SORT",
  id,
});

export const selectPaper = (paper) => ({
  type: "SELECT_PAPER",
  safeId: paper.safe_id,
  paper,
  not_from_mediator: true,
});

export const selectPaperFromMediator = (safeId) => ({
  type: "SELECT_PAPER",
  safeId,
});

export const deselectPaper = () => ({
  type: "DESELECT_PAPER",
});

export const hoverArea = (paper) => ({
  type: "HOVER_AREA",
  paper,
});

export const showPreview = (paper) => ({
  type: "SHOW_PREVIEW",
  paper,
});

export const hidePreview = () => ({
  type: "HIDE_PREVIEW",
});

export const deselectPaperBacklink = () => ({
  type: "DESELECT_PAPER_BACKLINK",
});

export const setListHeight = (listHeight) => ({
  type: "RESIZE",
  listHeight
});
