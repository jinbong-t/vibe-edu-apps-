export interface AppItem {
  id: string;
  title: string;
  category: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  isActive: boolean;
}

export const CATEGORIES = ['전체', '수업', '학급운영', '업무', '기타'];

export const appsData: AppItem[] = [
  {
    id: "app-001",
    title: "단어 암기 트레이너",
    category: "학급운영",
    url: "https://example.com",
    thumbnailUrl: "",
    description: "반복 학습 기반 단어 암기 앱 샘플입니다.",
    isActive: true,
  },
  {
    id: "app-002",
    title: "학생 랜덤 뽑기",
    category: "학급운영",
    url: "https://example.com/random",
    thumbnailUrl: "",
    description: "발표자나 청소 당번을 공정하게 뽑아보세요.",
    isActive: true,
  },
  {
    id: "app-003",
    title: "자리 바꾸기 프로그램",
    category: "학급운영",
    url: "https://example.com/seat",
    thumbnailUrl: "",
    description: "학생들의 자리를 무작위로 또는 조건에 맞춰 배치합니다.",
    isActive: true,
  },
  {
    id: "app-004",
    title: "수업용 타이머",
    category: "수업",
    url: "https://example.com/timer",
    thumbnailUrl: "",
    description: "집중력을 높여주는 깔끔한 수업용 타이머입니다.",
    isActive: true,
  },
  {
    id: "app-005",
    title: "성적 처리 엑셀 자동화",
    category: "업무",
    url: "https://example.com/grade",
    thumbnailUrl: "",
    description: "복잡한 성적 처리를 간편하게 도와주는 엑셀 템플릿 앱.",
    isActive: true,
  }
];
