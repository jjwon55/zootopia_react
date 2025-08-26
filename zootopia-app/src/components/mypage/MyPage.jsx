import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from '../../assets/img/default-profile.png';

/** 서버 경로를 안전한 이미지 URL로 변환 */
const resolveImg = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  if (src.startsWith('/')) return `/api${src}`;
  return `/api/${src}`;
};

export default function MyPage({
  me,
  pets = [],
  myPosts = [],
  myComments = [],
  likedPosts = [],
  loginUserId,
  onEditClick,
}) {
  if (!me) return null;

  const profileSrc = resolveImg(me.profileImg) || defaultProfile;
  const canEdit = loginUserId && me.userId && String(loginUserId) === String(me.userId);

  const postLink = (category, postId) => {
    if (category === '자랑글') return `/showoff/read/${postId}`;
    if (category === '자유글' || category === '질문글') return `/posts/read/${postId}`;
    return `/lost/read/${postId}`;
  };

  return (
    <div className="tw:py-6">
      <div className="tw:max-w-[880px] tw:mx-auto tw:px-4">
        {/* 👤 내 프로필 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
            <h2 className="tw:text-[20px] tw:font-bold">내 프로필</h2>

            {canEdit && (
              onEditClick ? (
                <button
                  type="button"
                  onClick={onEditClick}
                  className="tw:text-sm tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-zinc-800 tw:text-white hover:tw:bg-zinc-700"
                >
                  수정하기
                </button>
              ) : (
                <Link
                  to="/mypage/edit"
                  className="tw:text-sm tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-zinc-800 tw:text-white hover:tw:bg-zinc-700"
                >
                  수정하기
                </Link>
              )
            )}
          </div>

          <div className="tw:flex tw:items-center">
            <img
              src={profileSrc}
              alt="프로필 이미지"
              className="tw:w-20 tw:h-20 tw:rounded-full tw:object-cover tw:mr-3"
            />
            <div>
              <div className="tw:font-semibold">{me.nickname}</div>
              <div className="tw:text-zinc-500">{me.email}</div>
              {me.intro && <div className="tw:mt-1">{me.intro}</div>}
            </div>
          </div>
        </section>

        {/* 🐶 반려동물 정보 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">반려동물 정보</h2>

          {(!pets || pets.length === 0) && (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              등록된 반려동물이 없습니다.
            </div>
          )}

          {pets?.map((pet) => (
            <div
              key={pet.userPetId ?? `${pet.name}-${pet.breed}-${pet.birthDate}`}
              className="tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-3"
            >
              <div className="tw:font-semibold">
                {pet.name}{' '}
                <span className="tw:text-zinc-600">({pet.species})</span>
              </div>
              <div className="tw:mt-1">품종: {pet.breed ?? '-'}</div>
              <div className="tw:mt-0.5">
                생일:{' '}
                {pet.birthDate
                  ? new Date(pet.birthDate).toISOString().slice(0, 10)
                  : '-'}
              </div>
            </div>
          ))}
        </section>

        {/* 📝 내가 쓴 글 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">📄 작성한 글</h2>

          {myPosts?.length ? (
            <ul className="tw:max-h-[300px] tw:overflow-y-auto tw:space-y-2">
              {myPosts.map((post) => (
                <li
                  key={post.postId}
                  className="tw:flex tw:items-center tw:gap-2 tw:bg-zinc-50 tw:rounded-lg tw:px-3 tw:py-2 hover:tw:bg-zinc-100"
                >
                  <span className="tw:text-[13px] tw:px-2 tw:py-1 tw:rounded tw:bg-zinc-600 tw:text-white">
                    {post.category}
                  </span>
                  <Link
                    to={postLink(post.category, post.postId)}
                    className="tw:font-semibold tw:text-zinc-800 tw:no-underline tw:truncate hover:tw:text-blue-600"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              작성한 게시글이 없습니다.
            </div>
          )}
        </section>

        {/* 💬 작성한 댓글 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">💬 작성한 댓글</h2>

          {myComments?.length ? (
            <ul className="tw:max-h-[300px] tw:overflow-y-auto tw:space-y-3">
              {myComments.map((c) => (
                <li
                  key={c.commentId}
                  className="tw:bg-zinc-50 tw:rounded-xl tw:p-3 tw:shadow-sm hover:tw:bg-zinc-100"
                >
                  <div className="tw:flex tw:items-center tw:gap-2 tw:mb-1.5">
                    <span className="tw:text-[12px] tw:px-2 tw:py-1 tw:rounded tw:bg-zinc-600 tw:text-white">
                      {c.postCategory ?? '카테고리'}
                    </span>
                    <Link
                      to={postLink(c.postCategory, c.postId)}
                      className="tw:font-semibold tw:text-zinc-800 tw:no-underline tw:truncate hover:tw:text-blue-600"
                      title={c.postTitle}
                    >
                      {c.postTitle}
                    </Link>
                  </div>
                  <div className="tw:text-[14px] tw:text-zinc-600">
                    작성한 댓글 : {c.content}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              작성한 댓글이 없습니다.
            </div>
          )}
        </section>

        {/* ❤️ 좋아요한 글 */}
        <section className="tw:mt-5 tw:mb-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">❤️ 좋아요한 글</h2>

          {likedPosts?.length ? (
            <ul className="tw:max-h-[300px] tw:overflow-y-auto tw:space-y-3">
              {likedPosts.map((post) => (
                <li
                  key={post.postId}
                  className="tw:flex tw:items-center tw:gap-2 tw:bg-zinc-50 tw:rounded-xl tw:p-3 tw:shadow-sm hover:tw:bg-zinc-100"
                >
                  <span className="tw:text-[12px] tw:px-2 tw:py-1 tw:rounded tw:bg-zinc-600 tw:text-white">
                    {post.category}
                  </span>
                  <Link
                    to={postLink(post.category, post.postId)}
                    className="tw:flex-1 tw:font-semibold tw:text-zinc-800 tw:no-underline tw:truncate hover:tw:text-blue-600"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              좋아요한 글이 없습니다.
            </div>
          )}
        </section>

        {/* 주문 상세 내역 */}
        <OrderSummarySection />
      </div>
    </div>
  );
}

// 주문 상세 내역 표시 섹션
function OrderSummarySection() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const qp = new URLSearchParams(window.location.search);
      const orderCodeFromQuery = qp.get('order');
      const raw = localStorage.getItem('zootopia:lastOrder');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (orderCodeFromQuery && parsed?.orderCode !== orderCodeFromQuery) {
        // 다른 주문 코드가 넘어온 경우에도 최신 한 건만 표시 (데모 목적)
        parsed.orderCode = orderCodeFromQuery;
      }
      setOrder(parsed);
    } catch {
      setOrder(null);
    }
  }, []);

  if (!order) return null;

  const fullAddr = [order?.shipping?.address, order?.shipping?.detailAddress]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="tw:mt-5 tw:mb-10 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
      <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">🧾 주문 상세 내역</h2>

      {/* 상품 목록 */}
      <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-zinc-200 tw:mb-4">
        <h3 className="tw:font-semibold tw:mb-3">구매 상품</h3>
        <ul className="tw:space-y-3">
          {(order.items || []).map((it) => (
            <li key={it.id} className="tw:flex tw:items-center tw:gap-3">
              <img
                src={it.imageUrl || '/vite.svg'}
                alt={it.name}
                className="tw:w-14 tw:h-14 tw:object-cover tw:rounded-md tw:border"
              />
              <div className="tw:flex-1">
                <div className="tw:font-medium">{it.name}</div>
                <div className="tw:text-sm tw:text-zinc-600">수량 {it.quantity}개</div>
              </div>
              <div className="tw:font-semibold">{(it.price * it.quantity).toLocaleString()}원</div>
            </li>
          ))}
        </ul>
      </div>

      {/* 배송 정보 */}
      <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-zinc-200 tw:mb-4">
        <h3 className="tw:font-semibold tw:mb-3">배송 정보</h3>
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-y-2">
          <FieldRow label="받는분 이름" value={order?.shipping?.name} />
          <FieldRow label="연락처" value={order?.shipping?.phone} />
          <FieldRow label="우편번호" value={order?.shipping?.zipcode} />
          <FieldRow label="주소" value={fullAddr} className="md:tw:col-span-2" />
          <FieldRow label="배송메모" value={order?.shipping?.message || '-'} className="md:tw:col-span-2" />
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-zinc-200">
        <div className="tw:flex tw:justify-between tw:text-lg">
          <span className="tw:text-zinc-600">결제 금액</span>
          <span className="tw:font-bold tw:text-pink-600">{(order?.amount || 0).toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
}

function FieldRow({ label, value, className = '' }) {
  return (
    <div className={`tw:flex tw:items-center tw:gap-3 ${className}`}>
      <div className="tw:w-28 tw:text-sm tw:text-zinc-500">{label}</div>
      <div className="tw:flex-1 tw:font-medium">{value ?? '-'}</div>
    </div>
  );
}
