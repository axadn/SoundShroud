export const logged_in = state => Boolean(state.session.current_user);
export const current_user_id = state => state.session.current_user.id;
export const currentPlaylistId = state => state.entities.tracks.playlistIds[
    state.entities.tracks.playlistIndex
];