import React, { useEffect, useState } from "react";
import "./Family.css";

const LOCAL_STORAGE_KEY = "family-tree-data-v1";

const defaultData = {
people: {
father: {
id: "father",
fullName: "Father",
dob: "",
imageUrl: "",
instagram: "",
linkedin: "",
phone: "",
whatsapp: "",
parentId: null,
fatherParentId: null,
motherParentId: null,
parentType: "father",
childrenIds: ["child1", "child2"],
spouseId: "mother",
},
mother: {
id: "mother",
fullName: "Mother",
dob: "",
imageUrl: "",
instagram: "",
linkedin: "",
phone: "",
whatsapp: "",
parentId: null,
fatherParentId: null,
motherParentId: null,
parentType: "mother",
childrenIds: ["child1", "child2"],
spouseId: "father",
},
child1: {
id: "child1",
fullName: "Child 1",
dob: "",
imageUrl: "",
instagram: "",
linkedin: "",
phone: "",
whatsapp: "",
parentId: "father",
parentType: null,
childrenIds: [],
spouseId: null,
},
child2: {
id: "child2",
fullName: "Child 2",
dob: "",
imageUrl: "",
instagram: "",
linkedin: "",
phone: "",
whatsapp: "",
parentId: "father",
parentType: null,
childrenIds: [],
spouseId: null,
},
},
rootId: "father",
};

function createEmptyPerson() {
return {
fullName: "",
dob: "",
imageUrl: "",
instagram: "",
linkedin: "",
phone: "",
whatsapp: "",
};
}

function sanitizePhoneNumber(num) {
if (!num) return "";
return num.replace(/[^\d]/g, "");
}

function Family() {
const [treeData, setTreeData] = useState(defaultData);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
const [modalTargetId, setModalTargetId] = useState(null);
const [relationType, setRelationType] = useState("child"); // "child", "parent-father", "parent-mother", "spouse", "edit"
const [memberForms, setMemberForms] = useState([createEmptyPerson()]);
const [profilePersonId, setProfilePersonId] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);

// Load from localStorage
useEffect(() => {
try {
const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
if (saved) {
const parsed = JSON.parse(saved);
if (parsed && parsed.people && parsed.rootId) {
  setTreeData(parsed);
}
}
} catch (err) {
console.error("Failed to load family tree from localStorage", err);
}
}, []);

// Save to localStorage
useEffect(() => {
try {
localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(treeData));
} catch (err) {
console.error("Failed to save family tree to localStorage", err);
}
}, [treeData]);

const mapPersonToForm = (person) => ({
fullName: person?.fullName || "",
dob: person?.dob || "",
imageUrl: person?.imageUrl || "",
instagram: person?.instagram || "",
linkedin: person?.linkedin || "",
phone: person?.phone || "",
whatsapp: person?.whatsapp || "",
});

const getAncestorForSlot = (personId, slot) => {
const target = treeData.people[personId];
if (!target) return null;
const directParent = target.parentId ? treeData.people[target.parentId] : null;

if (slot === "father") {
if (directParent && (directParent.parentType === "father" || !directParent.parentType)) {
return directParent;
}
if (
directParent &&
directParent.parentType === "mother" &&
directParent.spouseId &&
treeData.people[directParent.spouseId]
) {
return treeData.people[directParent.spouseId];
}
return null;
}

// mother slot
if (directParent && directParent.parentType === "mother") {
return directParent;
}
if (
directParent &&
(directParent.parentType === "father" || !directParent.parentType) &&
directParent.spouseId &&
treeData.people[directParent.spouseId]
) {
return treeData.people[directParent.spouseId];
}
return null;
};

const openAddModal = (targetId, type = "child") => {
setModalTargetId(targetId);
setRelationType(type);

if (type === "parent-father" || type === "parent-mother") {
// For adding parents, initialize with 2 forms (grandfather and grandmother)
const target = treeData.people[targetId];
const parentField = type === "parent-father" ? "fatherParentId" : "motherParentId";
const fatherParentId = target?.[parentField];

let forms = [createEmptyPerson(), createEmptyPerson()];

if (fatherParentId) {
const fatherParent = treeData.people[fatherParentId];
const motherParent = fatherParent?.spouseId ? treeData.people[fatherParent.spouseId] : null;

if (fatherParent) {
  forms[0] = mapPersonToForm(fatherParent);
}
if (motherParent) {
  forms[1] = mapPersonToForm(motherParent);
}
}

setMemberForms(forms);
} else if (type === "edit") {
const person = treeData.people[targetId];
if (person) {
setMemberForms([mapPersonToForm(person)]);
} else {
setMemberForms([createEmptyPerson()]);
}
} else {
setMemberForms([createEmptyPerson()]);
}

setIsEditMode(type === "edit");
setIsAddModalOpen(true);
};

const openEditModal = (personId) => {
const person = treeData.people[personId];
if (!person) return;
setModalTargetId(personId);
setRelationType("edit");
setMemberForms([mapPersonToForm(person)]);
setIsEditMode(true);
setIsAddModalOpen(true);
};

const closeAddModal = () => {
setIsAddModalOpen(false);
setIsEditMode(false);
setModalTargetId(null);
setMemberForms([createEmptyPerson()]);
setRelationType("child");
};

const openProfileModal = (personId) => {
setProfilePersonId(personId);
setIsProfileModalOpen(true);
};

const closeProfileModal = () => {
setProfilePersonId(null);
setIsProfileModalOpen(false);
};

const handleMemberFieldChange = (index, field, value) => {
setMemberForms((prev) => {
const updated = [...prev];
updated[index] = {
...updated[index],
[field]: value,
};
return updated;
});
};

const handleAddMemberRow = () => {
setMemberForms((prev) => [...prev, createEmptyPerson()]);
};

const handleRemoveMemberRow = (index) => {
setMemberForms((prev) => prev.filter((_, i) => i !== index));
};

const handleImageUpload = (index, file) => {
if (!file) return;

const reader = new FileReader();
reader.onloadend = () => {
handleMemberFieldChange(index, "imageUrl", reader.result);
};
reader.readAsDataURL(file);
};

const handleSubmitModal = (e) => {
e.preventDefault();
if (!modalTargetId) return;

if (relationType === "edit" && isEditMode) {
// Update single person
const form = memberForms[0];
setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const person = updatedPeople[modalTargetId];
if (!person) return prev;

updatedPeople[modalTargetId] = {
  ...person,
  fullName: form.fullName,
  dob: form.dob,
  imageUrl: form.imageUrl,
  instagram: form.instagram,
  linkedin: form.linkedin,
  phone: form.phone,
  whatsapp: form.whatsapp,
};
return {
  ...prev,
  people: updatedPeople,
};
});
closeAddModal();
return;
}

if (relationType === "child") {
handleAddChildren(modalTargetId, memberForms);
} else if (relationType === "spouse") {
handleAddSpouse(modalTargetId, memberForms);
} else if (relationType === "parent-father" || relationType === "parent-mother") {
handleAddParentEntry(
modalTargetId,
memberForms,
relationType === "parent-father" ? "father" : "mother"
);
}

closeAddModal();
};

const handleAddChildren = (targetId, members) => {
setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const target = updatedPeople[targetId];
if (!target) return prev;

const targetChildren = new Set(target.childrenIds || []);
const spouseId = target.spouseId;

members.forEach((m) => {
if (!m.fullName.trim()) return;
const id = `p_${Date.now()}_${Math.random().toString(36).slice(2)}`;
updatedPeople[id] = {
  id,
  fullName: m.fullName,
  dob: m.dob,
  imageUrl: m.imageUrl,
  instagram: m.instagram,
  linkedin: m.linkedin,
  phone: m.phone,
  whatsapp: m.whatsapp,
  parentId: targetId,
  parentType: null,
  childrenIds: [],
  spouseId: null,
};
targetChildren.add(id);
});

updatedPeople[targetId] = {
...target,
childrenIds: Array.from(targetChildren),
};

if (spouseId && updatedPeople[spouseId]) {
updatedPeople[spouseId] = {
  ...updatedPeople[spouseId],
  childrenIds: Array.from(targetChildren),
};
}

return {
...prev,
people: updatedPeople,
};
});
};

const handleAddSpouse = (targetId, members) => {
const firstFilled = members.find((m) => m.fullName.trim());
if (!firstFilled) return;

setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const target = updatedPeople[targetId];
if (!target) return prev;

const spouseId = `p_${Date.now()}_${Math.random().toString(36).slice(2)}`;
updatedPeople[spouseId] = {
id: spouseId,
fullName: firstFilled.fullName,
dob: firstFilled.dob,
imageUrl: firstFilled.imageUrl,
instagram: firstFilled.instagram,
linkedin: firstFilled.linkedin,
phone: firstFilled.phone,
whatsapp: firstFilled.whatsapp,
parentId: target.parentId,
parentType: null,
childrenIds: target.childrenIds || [],
spouseId: targetId,
};

updatedPeople[targetId] = {
...target,
spouseId: spouseId,
};

return {
...prev,
people: updatedPeople,
};
});
};

const handleRemoveChild = (childId) => {
if (!window.confirm("Remove this child?")) return;

setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const child = updatedPeople[childId];
if (!child || !child.parentId) return prev;

const parentId = child.parentId;
const parent = updatedPeople[parentId];

if (parent) {
updatedPeople[parentId] = {
  ...parent,
  childrenIds: parent.childrenIds.filter((id) => id !== childId),
};
}

// Also remove from spouse if exists
if (parent && parent.spouseId && updatedPeople[parent.spouseId]) {
updatedPeople[parent.spouseId] = {
  ...updatedPeople[parent.spouseId],
  childrenIds: updatedPeople[parent.spouseId].childrenIds.filter((id) => id !== childId),
};
}

delete updatedPeople[childId];

return {
...prev,
people: updatedPeople,
};
});
};

const handleAddParentEntry = (targetId, forms, slot) => {
// Filter out empty forms
const filledForms = forms.filter((f) => f?.fullName?.trim());
if (filledForms.length === 0) return;

setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const target = updatedPeople[targetId];
if (!target) return prev;

const parentField = slot === "father" ? "fatherParentId" : "motherParentId";
const existingParentId = target[parentField];

// First form is Grandfather, second form is Grandmother
const grandfatherForm = filledForms[0];
const grandmotherForm = filledForms[1];

const createPersonData = (form) => ({
fullName: form.fullName || "",
dob: form.dob || "",
imageUrl: form.imageUrl || "",
instagram: form.instagram || "",
linkedin: form.linkedin || "",
phone: form.phone || "",
whatsapp: form.whatsapp || "",
});

let grandfatherId = existingParentId;
let grandmotherId = null;

// Update or create Grandfather
if (existingParentId && updatedPeople[existingParentId]) {
const existingGrandfather = updatedPeople[existingParentId];
updatedPeople[existingParentId] = {
  ...existingGrandfather,
  ...createPersonData(grandfatherForm),
};
grandfatherId = existingParentId;
grandmotherId = existingGrandfather.spouseId;
} else {
grandfatherId = `p_${Date.now()}_${Math.random().toString(36).slice(2)}`;
updatedPeople[grandfatherId] = {
  id: grandfatherId,
  ...createPersonData(grandfatherForm),
  parentId: null,
  fatherParentId: null,
  motherParentId: null,
  childrenIds: [targetId],
  spouseId: null,
};
}

// Update or create Grandmother
if (grandmotherForm?.fullName?.trim()) {
if (grandmotherId && updatedPeople[grandmotherId]) {
  updatedPeople[grandmotherId] = {
    ...updatedPeople[grandmotherId],
    ...createPersonData(grandmotherForm),
  };
} else {
  grandmotherId = `p_${Date.now() + 1}_${Math.random().toString(36).slice(2)}`;
  updatedPeople[grandmotherId] = {
    id: grandmotherId,
    ...createPersonData(grandmotherForm),
    parentId: null,
    fatherParentId: null,
    motherParentId: null,
    childrenIds: [targetId],
    spouseId: grandfatherId,
  };
  updatedPeople[grandfatherId] = {
    ...updatedPeople[grandfatherId],
    spouseId: grandmotherId,
  };
}
}

// Update target to point to grandfather
updatedPeople[targetId] = {
...target,
[parentField]: grandfatherId,
};

// Update root if needed
const newRootId = !prev.rootId || prev.rootId === targetId ? grandfatherId : prev.rootId;

return {
...prev,
people: updatedPeople,
rootId: newRootId,
};
});
};

const handleDeletePerson = (personId) => {
const person = treeData.people[personId];
if (!person) return;

const personName = person.fullName || "this person";
if (!window.confirm(`Delete ${personName}?`)) return;

setTreeData((prev) => {
const updatedPeople = { ...prev.people };
const personToDelete = updatedPeople[personId];
if (!personToDelete) return prev;

// Store references before deletion
const spouseId = personToDelete.spouseId;
const childrenIds = personToDelete.childrenIds || [];
const parentId = personToDelete.parentId;

// Remove this person from parent's childrenIds
if (parentId && updatedPeople[parentId]) {
const parent = updatedPeople[parentId];
updatedPeople[parentId] = {
  ...parent,
  childrenIds: parent.childrenIds.filter((cid) => cid !== personId),
};
}

// Remove spouse reference if exists
if (spouseId && updatedPeople[spouseId]) {
updatedPeople[spouseId] = {
  ...updatedPeople[spouseId],
  spouseId: null,
  // Remove children from spouse's childrenIds
  childrenIds: updatedPeople[spouseId].childrenIds.filter((cid) => !childrenIds.includes(cid)),
};
}

// Update children's parentId (assign to spouse if exists, otherwise remove parent)
childrenIds.forEach((childId) => {
if (updatedPeople[childId]) {
  if (spouseId && updatedPeople[spouseId]) {
    // Assign child to spouse and add to spouse's childrenIds
    updatedPeople[childId] = {
      ...updatedPeople[childId],
      parentId: spouseId,
    };
    // Add child to spouse's childrenIds if not already there
    if (!updatedPeople[spouseId].childrenIds.includes(childId)) {
      updatedPeople[spouseId] = {
        ...updatedPeople[spouseId],
        childrenIds: [...updatedPeople[spouseId].childrenIds, childId],
      };
    }
  } else {
    // Remove parent reference
    updatedPeople[childId] = {
      ...updatedPeople[childId],
      parentId: null,
    };
  }
}
});

// Delete only this person (not descendants)
delete updatedPeople[personId];

// Update rootId if needed
let newRootId = prev.rootId;
if (personId === prev.rootId) {
// If root deleted, pick spouse or first remaining person
const remainingIds = Object.keys(updatedPeople);
newRootId = spouseId && updatedPeople[spouseId]
  ? spouseId
  : remainingIds[0] || null;
}

return {
...prev,
people: updatedPeople,
rootId: newRootId,
};
});

// Close profile modal if the deleted person was being viewed
if (profilePersonId === personId) {
setProfilePersonId(null);
setIsProfileModalOpen(false);
}
};

const rootPerson = treeData.people[treeData.rootId];

return (
<div className="family-tree-container">
{/* Header with Info Icon */}
<header className="family-tree-header">
<div className="family-tree-header-content">
  <h1 className="family-tree-title">Family Tree</h1>
  <button
    className="family-tree-info-btn"
    type="button"
    onClick={() => setIsInfoModalOpen(true)}
    title="How to use Family Tree"
  >
    <i className="fa fa-circle-info" aria-hidden="true"></i>
  </button>
</div>
<p className="family-tree-subtitle">Build and explore your family connections</p>
</header>

<main className="family-tree-tree-wrapper">
{rootPerson ? (
  <FamilyTreeNode
    person={rootPerson}
    people={treeData.people}
    onSelect={openProfileModal}
    onAddClick={openAddModal}
    onRemoveChild={handleRemoveChild}
  />
) : (
  <p className="family-tree-empty">
    No family members yet. Start by adding a root person.
  </p>
)}
</main>

{/* Add / Edit Modal */}
{isAddModalOpen && (
<div className="family-tree-modal-overlay">
  <div className="family-tree-modal">
    <button
      className="family-tree-modal-close"
      onClick={closeAddModal}
    >
      ×
    </button>
    <h2 className="family-tree-modal-title">
      {isEditMode
        ? "Edit Person"
        : relationType === "parent-father"
        ? "Add Previous Generation (Father's Side)"
        : relationType === "parent-mother"
        ? "Add Previous Generation (Mother's Side)"
        : relationType === "spouse"
        ? "Add Spouse"
        : "Add New Generation (Children)"}
    </h2>

    {!isEditMode && (
      <div className="family-tree-modal-info">
        {relationType === "child" ? (
          <span>
            You can add one or more children (N members) at once.
          </span>
        ) : relationType === "parent-father" ? (
          <span>Add Father's parents (Grandfather and Grandmother). First row is Grandfather, second row is Grandmother.</span>
        ) : relationType === "parent-mother" ? (
          <span>Add Mother's parents (Grandfather and Grandmother). First row is Grandfather, second row is Grandmother.</span>
        ) : relationType === "spouse" ? (
          <span>
            Add a spouse for this person. Only the first filled person will be used.
          </span>
        ) : (
          <span>
            You can add one or two parents. First row will be Father and second row will be Mother (optional).
          </span>
        )}
      </div>
    )}

    <form onSubmit={handleSubmitModal}>
      <div className="family-tree-modal-body">
        {memberForms.map((m, idx) => (
          <div
            key={idx}
            className="family-tree-member-form-block"
          >
            {!isEditMode && (
              <div className="family-tree-member-form-header">
                <span>Member #{idx + 1}</span>
                {memberForms.length > 1 && (
                  <button
                    type="button"
                    className="family-tree-remove-member-btn"
                    onClick={() => handleRemoveMemberRow(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            <div className="family-tree-form-grid">
              <label className="family-tree-form-field">
                <span>Full Name</span>
                <input
                  type="text"
                  required
                  value={m.fullName}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "fullName",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="family-tree-form-field">
                <span>Date of Birth</span>
                <input
                  type="date"
                  value={m.dob}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "dob",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="family-tree-form-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  value={m.phone}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="+911234567890"
                />
              </label>

              <label className="family-tree-form-field family-tree-image-upload-field">
                <span>
                  <i className="fa fa-image"></i> Profile Image
                </span>
                <div className="family-tree-image-upload-wrapper">
                  {m.imageUrl ? (
                    <div className="family-tree-image-preview">
                      <img src={m.imageUrl} alt="Preview" />
                      <button
                        type="button"
                        className="family-tree-remove-image-btn"
                        onClick={() => handleMemberFieldChange(idx, "imageUrl", "")}
                        title="Remove image"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="family-tree-image-placeholder">
                      <i className="fa fa-user-circle"></i>
                      <span>No image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(idx, file);
                      }
                    }}
                    className="family-tree-file-input"
                    id={`image-upload-${idx}`}
                  />
                  <label
                    htmlFor={`image-upload-${idx}`}
                    className="family-tree-upload-btn"
                  >
                    <i className="fa fa-upload"></i> {m.imageUrl ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </label>

              <label className="family-tree-form-field">
                <span>Instagram URL</span>
                <input
                  type="url"
                  value={m.instagram}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "instagram",
                      e.target.value
                    )
                  }
                  placeholder="https://instagram.com/username"
                />
              </label>

              <label className="family-tree-form-field">
                <span>LinkedIn URL</span>
                <input
                  type="url"
                  value={m.linkedin}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </label>

              <label className="family-tree-form-field">
                <span>WhatsApp Number</span>
                <input
                  type="tel"
                  value={m.whatsapp}
                  onChange={(e) =>
                    handleMemberFieldChange(
                      idx,
                      "whatsapp",
                      e.target.value
                    )
                  }
                  placeholder="+911234567890"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="family-tree-modal-footer">
        {!isEditMode && relationType === "child" && (
          <button
            type="button"
            className="family-tree-add-member-btn"
            onClick={handleAddMemberRow}
          >
            + Add one more
          </button>
        )}

        <div className="family-tree-modal-actions">
          <button
            type="button"
            className="family-tree-btn-secondary"
            onClick={closeAddModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="family-tree-btn-primary"
          >
            {isEditMode ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
)}

{/* Profile Modal */}
{isProfileModalOpen && profilePersonId && (
<ProfileModal
  person={treeData.people[profilePersonId]}
  onClose={closeProfileModal}
  onEdit={() => openEditModal(profilePersonId)}
  onDelete={() => handleDeletePerson(profilePersonId)}
/>
)}

{/* Info Modal */}
{isInfoModalOpen && (
<InfoModal onClose={() => setIsInfoModalOpen(false)} />
)}
</div>
);
}

function FamilyTreeNode({ person, people, onSelect, onAddClick, onRemoveChild }) {
const spouse = person.spouseId ? people[person.spouseId] : null;
const children =
person.childrenIds?.map((id) => people[id]).filter(Boolean) || [];

// Get grandparents for father and mother separately
// If person is father: get from person.fatherParentId and spouse.motherParentId
// If person is mother: get from spouse.fatherParentId and person.motherParentId
const isFather = person.parentType === "father" || (!person.parentType && person.spouseId);
const isMother = person.parentType === "mother";

let fatherGrandfather = null;
let fatherGrandmother = null;
let motherGrandfather = null;
let motherGrandmother = null;

if (isFather) {
// Person is father, get father's grandparents from person, mother's from spouse
fatherGrandfather = person.fatherParentId ? people[person.fatherParentId] : null;
fatherGrandmother = fatherGrandfather?.spouseId ? people[fatherGrandfather.spouseId] : null;
motherGrandfather = spouse?.motherParentId ? people[spouse.motherParentId] : null;
motherGrandmother = motherGrandfather?.spouseId ? people[motherGrandfather.spouseId] : null;
} else if (isMother && spouse) {
// Person is mother, get father's grandparents from spouse, mother's from person
fatherGrandfather = spouse.fatherParentId ? people[spouse.fatherParentId] : null;
fatherGrandmother = fatherGrandfather?.spouseId ? people[fatherGrandfather.spouseId] : null;
motherGrandfather = person.motherParentId ? people[person.motherParentId] : null;
motherGrandmother = motherGrandfather?.spouseId ? people[motherGrandfather.spouseId] : null;
}

const showGrandparents = (isFather || isMother) && (fatherGrandfather || motherGrandfather);

// Helper to render a single person card
const renderPersonCard = (p, isSpouse = false) => (
<div className="family-tree-node-card-wrapper">
<div className="family-tree-node-connector" />
<div
className="family-tree-node-card"
onClick={() => onSelect(p.id)}
>
<div className="family-tree-node-avatar">
  {p.imageUrl ? (
    <img src={p.imageUrl} alt={p.fullName} />
  ) : (
    <div className="family-tree-node-avatar-placeholder">
      {p.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)}
    </div>
  )}
</div>
<div className="family-tree-node-info">
  <div className="family-tree-node-name">
    {p.fullName || "Unnamed"}
  </div>
  {p.dob && (
    <div className="family-tree-node-dob">
      DOB: {p.dob}
    </div>
  )}
</div>
{/* Plus icon (do NOT trigger profile) */}
<button
  className="family-tree-person-card-add-btn"
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    onAddClick(p.id, "child");
  }}
>
  <i className="fa fa-plus-square" aria-hidden="true" />
</button>
{/* Remove button for children */}
{p.parentId && (
  <button
    className="family-tree-node-remove-btn"
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onRemoveChild(p.id);
    }}
    title="Remove this child"
  >
    <i className="fa fa-times" aria-hidden="true" />
  </button>
)}
</div>
</div>
);

return (
<div className="family-tree-node">
      {/* Grandparents - show both sets above father-mother pair */}
      {showGrandparents && (
        <div className="family-tree-grandparents-container">
          <h3 className="family-tree-grandparents-title">Grandparents</h3>
          <div className="family-tree-grandparents-wrapper">
    {/* Father's grandparents */}
    <div className="family-tree-grandparents-set">
      {fatherGrandfather ? (
        <>
          <div className="family-tree-grandparents-spouse-pair">
            {renderPersonCard(fatherGrandfather)}
            <div className="family-tree-spouse-connector" />
            {fatherGrandmother ? (
              renderPersonCard(fatherGrandmother)
            ) : (
              <div className="family-tree-add-spouse-btn-wrapper">
                <button
                  className="family-tree-add-spouse-side-btn"
                  type="button"
                  onClick={() => onAddClick(fatherGrandfather.id, "spouse")}
                  title="Add Grandmother"
                >
                  <i className="fa fa-plus-square" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          <div className="family-tree-grandparents-connector" />
        </>
      ) : (
        <div className="family-tree-add-parent-btn-wrapper">
          <button
            className="family-tree-add-parent-btn"
            type="button"
            onClick={() => onAddClick(isFather ? person.id : (spouse ? spouse.id : person.id), "parent-father")}
            title="Add Previous Generation (Father's Side)"
          >
            <i className="fa fa-plus-square" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
    
    {/* Mother's grandparents */}
    <div className="family-tree-grandparents-set">
      {motherGrandfather ? (
        <>
          <div className="family-tree-grandparents-spouse-pair">
            {renderPersonCard(motherGrandfather)}
            <div className="family-tree-spouse-connector" />
            {motherGrandmother ? (
              renderPersonCard(motherGrandmother)
            ) : (
              <div className="family-tree-add-spouse-btn-wrapper">
                <button
                  className="family-tree-add-spouse-side-btn"
                  type="button"
                  onClick={() => onAddClick(motherGrandfather.id, "spouse")}
                  title="Add Grandmother"
                >
                  <i className="fa fa-plus-square" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          <div className="family-tree-grandparents-connector" />
        </>
      ) : (
        <div className="family-tree-add-parent-btn-wrapper">
          <button
            className="family-tree-add-parent-btn"
            type="button"
            onClick={() => onAddClick(isFather && spouse ? spouse.id : person.id, "parent-mother")}
            title="Add Previous Generation (Mother's Side)"
          >
            <i className="fa fa-plus-square" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  </div>
</div>
)}

{/* Parent buttons - show if no grandparents yet and person is father or mother */}
{!showGrandparents && (isFather || isMother) && (
<div className="family-tree-add-parent-btn-wrapper">
  <button
    className="family-tree-add-parent-btn"
    type="button"
    onClick={() => onAddClick(isFather ? person.id : (spouse ? spouse.id : person.id), "parent-father")}
    title="Add Previous Generation (Father's Side)"
  >
    <i className="fa fa-plus-square" aria-hidden="true" />
  </button>
  <button
    className="family-tree-add-parent-btn"
    type="button"
    onClick={() => onAddClick(isFather && spouse ? spouse.id : person.id, "parent-mother")}
    title="Add Previous Generation (Mother's Side)"
  >
    <i className="fa fa-plus-square" aria-hidden="true" />
  </button>
</div>
)}

      {/* Spouse Pair Container */}
      <div className={`family-tree-spouse-pair ${showGrandparents ? 'family-tree-spouse-pair-extended' : ''}`}>
        {renderPersonCard(person)}

        {spouse ? (
          <>
            <div className={`family-tree-spouse-connector ${showGrandparents ? 'family-tree-spouse-connector-extended' : ''}`} />
            {renderPersonCard(spouse, true)}
          </>
        ) : (
  <>
    <div className="family-tree-spouse-connector" />
    <div className="family-tree-add-spouse-btn-wrapper">
      <button
        className="family-tree-add-spouse-side-btn"
        type="button"
        onClick={() => onAddClick(person.id, "spouse")}
        title="Add spouse"
      >
        <i className="fa fa-plus-square" aria-hidden="true" />
      </button>
    </div>
  </>
)}
</div>

      {/* Children below */}
      <div className="family-tree-children-block">
        {children.length > 0 && (
          <>
            <div className="family-tree-vertical-connector" />
            <div className="family-tree-horizontal-line-wrapper">
              <div className="family-tree-horizontal-line-end-left" />
              <div className="family-tree-horizontal-line" />
              <div className="family-tree-horizontal-line-end-right" />
            </div>
          </>
        )}
        <div className="family-tree-children-wrapper">
          {children.map((child) => (
            <div key={child.id} className="family-tree-child-node-wrapper">
              <div className="family-tree-child-connector-from-line" />
              <FamilyTreeNode
                person={child}
                people={people}
                onSelect={onSelect}
                onAddClick={onAddClick}
                onRemoveChild={onRemoveChild}
              />
            </div>
          ))}
          {/* Add child button */}
          <div className="family-tree-add-child-btn-wrapper">
            <div className="family-tree-child-connector-from-line" />
            <button
              className="family-tree-add-child-side-btn"
              type="button"
              onClick={() => onAddClick(person.id, "child")}
              title="Add child"
            >
              <i className="fa fa-plus-square" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
</div>
);
}

function ProfileModal({ person, onClose, onEdit, onDelete }) {
if (!person) return null;

const phoneLink = person.phone
? `tel:${sanitizePhoneNumber(person.phone)}`
: null;
const waNumber =
sanitizePhoneNumber(person.whatsapp || person.phone || "") || null;
const whatsappLink = waNumber
? `https://wa.me/${waNumber}`
: null;

return (
<div className="family-tree-modal-overlay" onClick={onClose}>
<div
className="family-tree-profile-modal"
onClick={(e) => e.stopPropagation()}
>
<button
  className="family-tree-modal-close"
  onClick={onClose}
>
  ×
</button>
<div className="family-tree-profile-header">
  <div className="family-tree-profile-avatar-large">
    {person.imageUrl ? (
      <img src={person.imageUrl} alt={person.fullName} />
    ) : (
      <div className="family-tree-profile-avatar-placeholder-large">
        {person.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
      </div>
    )}
  </div>
  <div className="family-tree-profile-main-info">
    <h2 className="family-tree-profile-name">
      <i className="fa fa-user"></i> {person.fullName || "Unnamed"}
    </h2>
    {person.dob && (
      <p className="family-tree-profile-dob">
        <i className="fa fa-calendar"></i> Date of Birth: {person.dob}
      </p>
    )}
  </div>
</div>
<div className="family-tree-profile-body">
  {(person.instagram || person.linkedin || phoneLink || whatsappLink) && (
    <div className="family-tree-profile-section">
      <h3 className="family-tree-profile-section-title">
        <i className="fa fa-link"></i> Contact & Social Links
      </h3>
      <div className="family-tree-profile-links">
        {person.instagram && (
          <a
            href={person.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="family-tree-profile-link"
          >
            <i className="fab fa-instagram"></i> Instagram
          </a>
        )}
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="family-tree-profile-link"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        )}
        {phoneLink && (
          <a
            href={phoneLink}
            className="family-tree-profile-link"
          >
            <i className="fas fa-phone"></i> Call
          </a>
        )}
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="family-tree-profile-link"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        )}
      </div>
    </div>
  )}
</div>
<div className="family-tree-profile-footer">
  <button
    className="family-tree-btn-secondary"
    onClick={onEdit}
  >
    <i className="fa fa-edit"></i> Edit
  </button>
  <button
    className="family-tree-btn-danger"
    onClick={onDelete}
  >
    <i className="fa fa-trash"></i> Delete
  </button>
</div>
</div>
</div>
);
}

function InfoModal({ onClose }) {
return (
<div className="family-tree-modal-overlay" onClick={onClose}>
<div
className="family-tree-modal family-tree-info-modal"
onClick={(e) => e.stopPropagation()}
>
<button
  className="family-tree-modal-close"
  onClick={onClose}
>
  ×
</button>
<h2 className="family-tree-modal-title">
  <i className="fa fa-circle-info" style={{ marginRight: "0.5rem" }}></i>
  How to Use Family Tree
</h2>

<div className="family-tree-info-content">
  <section className="family-tree-info-section">
    <h3 className="family-tree-info-section-title">
      <i className="fa fa-plus-circle"></i> Adding Family Members
    </h3>
    <ul className="family-tree-info-list">
      <li>
        <strong>Add Parents:</strong> Click the <i className="fa fa-plus-square"></i> buttons above a person to add their Father or Mother. You can add them separately.
      </li>
      <li>
        <strong>Add Spouse:</strong> Click the <i className="fa fa-plus-square"></i> button next to a person to add their spouse.
      </li>
      <li>
        <strong>Add Children:</strong> Click the <i className="fa fa-plus-square"></i> button inside a person's card or the button below children to add new children. You can add multiple children at once.
      </li>
    </ul>
  </section>

  <section className="family-tree-info-section">
    <h3 className="family-tree-info-section-title">
      <i className="fa fa-edit"></i> Editing & Viewing
    </h3>
    <ul className="family-tree-info-list">
      <li>
        <strong>View Profile:</strong> Click on any person's card to view their full profile with contact information.
      </li>
      <li>
        <strong>Edit Details:</strong> Click "Edit" in the profile modal to update a person's information.
      </li>
      <li>
        <strong>Remove Child:</strong> Click the <i className="fa fa-times"></i> button on a child's card to remove them from the tree.
      </li>
    </ul>
  </section>

  <section className="family-tree-info-section">
    <h3 className="family-tree-info-section-title">
      <i className="fa fa-lightbulb"></i> Tips & Features
    </h3>
    <ul className="family-tree-info-list">
      <li>
        <strong>Auto-Save:</strong> All changes are automatically saved to your browser's local storage.
      </li>
      <li>
        <strong>Contact Links:</strong> Add Instagram, LinkedIn, Phone, and WhatsApp numbers to enable quick contact from profiles.
      </li>
      <li>
        <strong>Profile Images:</strong> Add image URLs to display photos in the family tree.
      </li>
      <li>
        <strong>Tree Structure:</strong> The tree automatically organizes family members in generations with visual connectors.
      </li>
    </ul>
  </section>

  <section className="family-tree-info-section">
    <h3 className="family-tree-info-section-title">
      <i className="fa fa-trash"></i> Deleting Members
    </h3>
    <ul className="family-tree-info-list">
      <li>
        <strong>Delete Person:</strong> Click "Delete" in a person's profile modal. This will remove only that person, not their descendants.
      </li>
      <li>
        <strong>Children Reassignment:</strong> If a parent is deleted, their children will be reassigned to the remaining spouse if available.
      </li>
    </ul>
  </section>
</div>

<div className="family-tree-modal-actions" style={{ marginTop: "1rem" }}>
  <button
    className="family-tree-btn-primary"
    onClick={onClose}
  >
    Got it!
  </button>
</div>
</div>
</div>
);
}

export default Family;
