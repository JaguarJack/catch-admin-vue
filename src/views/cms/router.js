export default {
  // cms 管理
  cmsUsers: () => import('./users'),
  cmsCategory: () => import('./category'),
  cmsModel: () => import('./model'),
  cmsModelFields: () => import('./model/fields'),
  cmsModelRelate: () => import('./model/usedAt'),
  cmsSiteLinks: () => import('./siteLinks'),
  cmsArticle: () => import('./article'),
  cmsArticleDetail: () => import('./article/detail'),
  cmsTag: () => import('./tag'),
  cmsComments: () => import('./comments'),
  cmsBanners: () => import('./banners')

}
