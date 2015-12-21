<?php
class DbConnector{
    var  $db;
	var $stmt;	
	function DbConnector(){
		$this->db  = new PDO('mysql:host=localhost;dbname=test','Vlad','');	
	}	

	function getField($sql){
		return $this->db->query($sql)->fetchColumn();
	}
	function queryPure($sql){
		return  $this->db->query($sql);
	}
	function deleteRecord($sql){
		return  $this->db->query($sql);
	}	
	
	function getAsArray($sql){
		return  $this->db->query($sql)->fetchAll(PDO::FETCH_NUM);
	}
	function getAllAsObj($sql){
		return  $this->db->query($sql)->fetchAll(PDO::FETCH_OBJ);
	}
	function query($sql,$ar){
			$stmt =   $this->db->prepare($sql);
			if(!$stmt) return $this->db->errorInfo();
			$res = $stmt->execute($ar);			
			if($res)return $stmt->fetchAll(PDO::FETCH_OBJ);
			return  $this->db->errorInfo();		
		//return $stmt->execute($arVars);		
	}
	function getNextAsSoc($result){
		return $result->fetch(PDO::FETCH_ASSOC);
	}
	function updateRow($sql,$ar){
			$stmt = $this->db->prepare($sql);
			if($stmt) return  $stmt->execute($ar);
		return	0;
	}
	function beginTransaction($sql){
		$this->db->beginTransaction();
		$this->stmt=$this->db->prepare($sql);
		
	}
	function execute($arVars){
		$this->stmt->execute($arVars);
	}
	function commit(){
		return $this->db()-> commit();
	}
	function errorInfo(){
	return $this->db->errorInfo();
	}
	
	function insertRow($sql,$ar){
			$stmt = $this->db->prepare($sql);
			if(!$stmt) return 0;
		 	$res = $stmt->execute($ar);
			if($res) return $this->db->lastInsertId();
			return 0;
	}	
}