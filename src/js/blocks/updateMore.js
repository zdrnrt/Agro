export function updateMore(elem, request) {
    const { page_count, page } = request;
    elem.dataset.page = page;
    if (page_count < page) {
      elem.disabled = true;
    }
}
