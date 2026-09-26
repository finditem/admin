# guest-inquiries/[id] 작업 계획

## 비회원 문의 이메일 답변과 IP 차단 (2026-09-26)

- [x] `POST /admin/guest-inquiries/{inquiryId}/reply` 답변 발송 API 훅 추가 (`src/api/fetch/admin`)
- [x] 상세 화면 하단에 답변 입력 폼을 추가하고, 발송 성공 시 상세와 목록 쿼리를 갱신
- [x] 이미 답변한 문의(`answered`)는 폼 대신 답변 완료 안내를 보여줌
- [x] 기존 이메일 복사 버튼을 답변 폼과 함께 배치
- [x] 문의 IP 차단 버튼과 확인 모달 추가 (`POST /admin/inquiries/{inquiryId}/block-ip`)
- [x] `GuestInquiriesDetailView.test.tsx`에 답변 폼 노출 케이스를 추가하고 `GuestInquiryReplyForm.test.tsx`를 새로 작성 (2026-09-26 통과)
