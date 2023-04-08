// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: '내 드라이브',
    path: '/dashboard/app',
    icon: icon('folder'),
  },
  {
    title: '전문가 작성 가이드',
    path: '/',
    icon: icon('download'),
  },
  {
    title: '휴지통',
    path: '/',
    icon: icon('trash'),
  },
  {
    title: '이용 크레딧',
    path: '/',
    icon: icon('credit'),
  },
];

export default navConfig;
